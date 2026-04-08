(function () {
  const SITE = {
    title: "気象夏の学校 2026",
    subtitle: "日本気象学会夏期特別セミナー",
    lead: "若手研究者・学生が集まり、研究発表と交流を通して学びを深めるための夏期特別セミナーです。"
  };

  const PAGES = {
    home: { id: "home", title: "ホーム", file: "index.html", content: "content/home.md", navRoot: "home", hero: true },
    overview: { id: "overview", title: "開催概要", file: "overview.html", content: "content/overview.md", navRoot: "overview", lead: "開催趣旨、対象、運営方針などをまとめています。" },
    schedule: { id: "schedule", title: "スケジュール", file: "schedule.html", content: "content/schedule.md", navRoot: "overview", lead: "現時点の暫定スケジュールです。確定次第更新します。" },
    access: { id: "access", title: "会場・アクセス", file: "access.html", content: "content/access.md", navRoot: "overview", lead: "会場、交通、宿泊の基本情報を掲載します。" },
    invited: { id: "invited", title: "招待講演", file: "invited.html", content: "content/invited.md", navRoot: "overview", lead: "招待講演の講演者と概要を掲載します。" },
    general: { id: "general", title: "一般講演", file: "general.html", content: "content/general.md", navRoot: "overview", lead: "一般講演の募集方針と提出スケジュールを掲載します。" },
    participants: { id: "participants", title: "参加者一覧", file: "participants.html", content: "content/participants.md", navRoot: "overview", lead: "参加予定者や実行委員会の一覧を掲載します。" },
    registration: { id: "registration", title: "参加申し込み", file: "registration.html", content: "content/registration.md", navRoot: "overview", lead: "参加登録、発表申込、支払いなどの案内を掲載します。" },
    observation: { id: "observation", title: "観測企画", file: "observation.html", content: "content/observation.md", navRoot: "overview", lead: "観測企画や屋外企画の案内を掲載します。" },
    sponsors: { id: "sponsors", title: "協賛", file: "sponsors.html", content: "content/sponsors.md", navRoot: "sponsors", lead: "協賛募集やご支援の案内を掲載します。" },
    faq: { id: "faq", title: "FAQ", file: "faq.html", content: "content/faq.md", navRoot: "faq", lead: "よくある質問をまとめています。" },
    links: { id: "links", title: "リンク", file: "links.html", content: "content/links.md", navRoot: "links", lead: "関連サイトや歴代の気象夏の学校ページへのリンクです。" },
    contact: { id: "contact", title: "お問い合わせ", file: "contact.html", content: "content/contact.md", navRoot: "contact", lead: "実行委員会への連絡先を掲載します。" }
  };

  const NAV_ITEMS = [
    { id: "home", label: "ホーム", href: "index.html" },
    {
      id: "overview",
      label: "開催概要",
      href: "overview.html",
      children: [
        { id: "schedule", label: "スケジュール", href: "schedule.html" },
        { id: "access", label: "会場・アクセス", href: "access.html" },
        { id: "invited", label: "招待講演", href: "invited.html" },
        { id: "general", label: "一般講演", href: "general.html" },
        { id: "participants", label: "参加者一覧", href: "participants.html" },
        { id: "registration", label: "参加申し込み", href: "registration.html" },
        { id: "observation", label: "観測企画", href: "observation.html" }
      ]
    },
    { id: "sponsors", label: "協賛", href: "sponsors.html" },
    { id: "faq", label: "FAQ", href: "faq.html" },
    { id: "links", label: "リンク", href: "links.html" },
    { id: "contact", label: "お問い合わせ", href: "contact.html" }
  ];

  const PLACEHOLDERS = {
    updates: { kind: "timeline", source: "data/updates.csv" },
    overview: { kind: "overview", source: "data/overview.csv" },
    "home-promo": { kind: "home-promo", source: "data/home_promo.csv", links: "data/home_social_links.csv" },
    schedule: {
      kind: "table",
      source: "data/schedule.csv",
      columns: [
        { key: "day", label: "日程" },
        { key: "time", label: "時間" },
        { key: "program", label: "企画" },
        { key: "details", label: "備考" }
      ]
    },
    invited: { kind: "invited-talks", source: "data/invited_talks.csv" },
    general: {
      kind: "table",
      source: "data/general_presentations.csv",
      columns: [
        { key: "category", label: "区分" },
        { key: "deadline", label: "締切" },
        { key: "format", label: "形式" },
        { key: "note", label: "備考" }
      ]
    },
    participants: {
      kind: "table",
      source: "data/participants.csv",
      compact: true,
      columns: [
        { key: "division", label: "区分" },
        { key: "name", label: "氏名" },
        { key: "affiliation", label: "所属" },
        { key: "topic", label: "担当・研究分野" }
      ]
    },
    observation: {
      kind: "table",
      source: "data/observation_programs.csv",
      columns: [
        { key: "time", label: "時間帯" },
        { key: "activity", label: "企画" },
        { key: "note", label: "備考" }
      ]
    },
    sponsors: { kind: "cards", source: "data/sponsors.csv" },
    faq: { kind: "faq", source: "data/faq.csv" },
    links: { kind: "cards", source: "data/links.csv" }
  };

  const textCache = new Map();
  const csvCache = new Map();
  let heroSlideshowTimer = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderInline(text) {
    const codeStore = [];
    let value = escapeHtml(text);

    value = value.replace(/`([^`]+)`/g, function (_, code) {
      const token = "%%CODE" + codeStore.length + "%%";
      codeStore.push("<code>" + escapeHtml(code) + "</code>");
      return token;
    });

    value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      return '<a href="' + escapeHtml(href) + '">' + label + "</a>";
    });
    value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    return value.replace(/%%CODE(\d+)%%/g, function (_, index) {
      return codeStore[Number(index)];
    });
  }

  function renderTextBlock(text) {
    return String(text)
      .split(/\n{2,}/)
      .map(function (paragraph) {
        return paragraph.trim();
      })
      .filter(Boolean)
      .map(function (paragraph) {
        return "<p>" + renderInline(paragraph).replace(/\n/g, "<br>") + "</p>";
      })
      .join("");
  }

  function isSpecialLine(line, nextLine) {
    const trimmed = line.trim();
    return (
      trimmed === "" ||
      /^::[a-z0-9_-]+::$/.test(trimmed) ||
      /^#{1,6}\s+/.test(trimmed) ||
      /^>\s?/.test(trimmed) ||
      /^[-*]\s+/.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed) ||
      /^!\[.*\]\((.+)\)$/.test(trimmed) ||
      (trimmed.includes("|") && typeof nextLine === "string" && /^\s*\|?[\s:-|]+\|?\s*$/.test(nextLine.trim()))
    );
  }

  function parseTableRow(line) {
    const raw = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return raw.split("|").map(function (cell) {
      return cell.trim();
    });
  }

  function parseMarkdownBlocks(markdown) {
    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    const blocks = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (!trimmed) {
        index += 1;
        continue;
      }

      const placeholderMatch = trimmed.match(/^::([a-z0-9_-]+)::$/);
      if (placeholderMatch) {
        blocks.push({ type: "placeholder", name: placeholderMatch[1] });
        index += 1;
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        blocks.push({ type: "heading", level: headingMatch[1].length, text: headingMatch[2] });
        index += 1;
        continue;
      }

      if (/^!\[.*\]\((.+)\)$/.test(trimmed)) {
        const imageMatch = trimmed.match(/^!\[(.*)\]\((.+)\)$/);
        blocks.push({ type: "image", alt: imageMatch[1], src: imageMatch[2] });
        index += 1;
        continue;
      }

      if (/^>\s?/.test(trimmed)) {
        const quoteLines = [];
        while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
          quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
          index += 1;
        }
        blocks.push({ type: "blockquote", lines: quoteLines });
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        const items = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
          index += 1;
        }
        blocks.push({ type: "list", ordered: false, items: items });
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
          index += 1;
        }
        blocks.push({ type: "list", ordered: true, items: items });
        continue;
      }

      if (trimmed.includes("|") && index + 1 < lines.length && /^\s*\|?[\s:-|]+\|?\s*$/.test(lines[index + 1].trim())) {
        const headers = parseTableRow(lines[index]);
        const rows = [];
        index += 2;
        while (index < lines.length && lines[index].trim().includes("|")) {
          rows.push(parseTableRow(lines[index]));
          index += 1;
        }
        blocks.push({ type: "markdown-table", headers: headers, rows: rows });
        continue;
      }

      const paragraphLines = [];
      while (index < lines.length && !isSpecialLine(lines[index], lines[index + 1])) {
        paragraphLines.push(lines[index].trim());
        index += 1;
      }
      blocks.push({ type: "paragraph", lines: paragraphLines });
    }

    return blocks;
  }

  function renderMarkdownBlock(block) {
    if (block.type === "heading") {
      return "<h" + block.level + ">" + renderInline(block.text) + "</h" + block.level + ">";
    }
    if (block.type === "paragraph") {
      return "<p>" + renderInline(block.lines.join(" ")) + "</p>";
    }
    if (block.type === "blockquote") {
      return "<blockquote>" + renderTextBlock(block.lines.join("\n")) + "</blockquote>";
    }
    if (block.type === "list") {
      const tag = block.ordered ? "ol" : "ul";
      return "<" + tag + ">" + block.items.map(function (item) {
        return "<li>" + renderInline(item) + "</li>";
      }).join("") + "</" + tag + ">";
    }
    if (block.type === "image") {
      return '<figure class="markdown-image"><img src="' + escapeHtml(block.src) + '" alt="' + escapeHtml(block.alt) + '"></figure>';
    }
    if (block.type === "markdown-table") {
      const head = block.headers.map(function (header) {
        return "<th>" + renderInline(header) + "</th>";
      }).join("");
      const body = block.rows.map(function (row) {
        return "<tr>" + row.map(function (cell) {
          return "<td>" + renderInline(cell) + "</td>";
        }).join("") + "</tr>";
      }).join("");
      return '<div class="table-scroll"><table class="data-table"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
    }
    return "";
  }

  async function fetchText(path) {
    if (!textCache.has(path)) {
      textCache.set(path, fetch(path).then(function (response) {
        if (!response.ok) {
          throw new Error(path + " の読み込みに失敗しました。");
        }
        return response.text();
      }));
    }
    return textCache.get(path);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (inQuotes) {
        if (char === '"') {
          if (text[index + 1] === '"') {
            cell += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          cell += char;
        }
        continue;
      }
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(cell);
        cell = "";
      } else if (char === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (char !== "\r") {
        cell += char;
      }
    }

    if (cell.length > 0 || row.length > 0) {
      row.push(cell);
      rows.push(row);
    }

    const filtered = rows.filter(function (currentRow) {
      return currentRow.some(function (value) {
        return String(value).trim() !== "";
      });
    });

    if (filtered.length === 0) {
      return [];
    }

    const headers = filtered[0].map(function (header) {
      return String(header).trim();
    });

    return filtered.slice(1).map(function (currentRow) {
      const item = {};
      headers.forEach(function (header, headerIndex) {
        item[header] = String(currentRow[headerIndex] || "").trim();
      });
      return item;
    });
  }

  async function fetchCsv(path) {
    if (!csvCache.has(path)) {
      csvCache.set(path, fetchText(path).then(function (text) {
        return parseCsv(text);
      }));
    }
    return csvCache.get(path);
  }

  function csvRowsToMap(rows) {
    const result = {};
    rows.forEach(function (row) {
      if (row.key) {
        result[row.key] = row.value || "";
      }
    });
    return result;
  }

  function renderTimeline(rows) {
    const sortedRows = rows.slice().reverse();

    return '<ul class="timeline-list">' + sortedRows.map(function (row) {
      return '<li class="timeline-list__item"><time class="timeline-list__date">' +
        renderInline(row.date || "") +
        '</time><div class="timeline-list__body"><strong>' +
        renderInline(row.title || "") +
        "</strong>" +
        renderTextBlock(row.body || "") +
        "</div></li>";
    }).join("") + "</ul>";
  }

  function renderOverviewTable(rows) {
    return '<table class="info-table"><tbody>' + rows.map(function (row) {
      const note = row.note ? '<div class="table-note">' + renderInline(row.note) + "</div>" : "";
      return "<tr><th>" + renderInline(row.item || "") + "</th><td><strong>" + renderInline(row.value || "") + "</strong>" + note + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function stripOuterParagraph(html) {
    if (html.startsWith("<p>") && html.endsWith("</p>") && html.indexOf("</p><p>") === -1) {
      return html.slice(3, -4);
    }
    return html;
  }

  function renderDataTable(rows, config) {
    const head = config.columns.map(function (column) {
      return "<th>" + escapeHtml(column.label) + "</th>";
    }).join("");
    const body = rows.map(function (row) {
      const cells = config.columns.map(function (column) {
        return "<td>" + stripOuterParagraph(renderTextBlock(row[column.key] || "")) + "</td>";
      }).join("");
      return "<tr>" + cells + "</tr>";
    }).join("");
    const compactClass = config.compact ? " data-table--compact" : "";
    return '<div class="table-scroll"><table class="data-table' + compactClass + '"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  function renderCards(rows) {
    return '<div class="card-grid">' + rows.map(function (row) {
      const image = row.image ? '<img class="info-card__image" src="' + escapeHtml(row.image) + '" alt="' + escapeHtml(row.title || "") + '">' : "";
      const category = row.category ? '<p class="info-card__eyebrow">' + renderInline(row.category) + "</p>" : "";
      const subtitle = row.subtitle ? '<p class="info-card__subtitle">' + renderInline(row.subtitle) + "</p>" : "";
      const text = row.text ? '<div class="info-card__text">' + renderTextBlock(row.text) + "</div>" : "";
      const link = row.link ? '<p class="info-card__link"><a href="' + escapeHtml(row.link) + '">' + renderInline(row.link_label || "詳細を見る") + "</a></p>" : "";
      return '<section class="info-card">' + image + '<div class="info-card__body">' + category + "<h3>" + renderInline(row.title || "") + "</h3>" + subtitle + text + link + "</div></section>";
    }).join("") + "</div>";
  }

  function renderInvitedTalks(rows) {
    const summaryCards = rows.map(function (row, index) {
      const anchor = row.anchor || ("speaker-" + (index + 1));
      const image = row.image ? '<img class="info-card__image" src="' + escapeHtml(row.image) + '" alt="' + escapeHtml(row.name || row.title || "") + '">' : "";
      const category = row.category ? '<p class="info-card__eyebrow">' + renderInline(row.category) + "</p>" : "";
      const subtitle = row.affiliation ? '<p class="info-card__subtitle">' + renderInline(row.affiliation) + "</p>" : "";
      const theme = row.talk_title ? '<p class="invited-summary__theme">' + renderInline(row.talk_title) + "</p>" : "";
      return '<section class="info-card invited-summary-card">' + image + '<div class="info-card__body">' + category + '<h3><a href="#' + escapeHtml(anchor) + '">' + renderInline(row.name || row.title || "") + '</a></h3>' + subtitle + theme + '</div></section>';
    }).join("");

    const detailBlocks = rows.map(function (row, index) {
      const anchor = row.anchor || ("speaker-" + (index + 1));
      const image = row.image ? '<div class="invited-detail__image-wrap"><img class="invited-detail__image" src="' + escapeHtml(row.image) + '" alt="' + escapeHtml(row.name || row.title || "") + '"></div>' : "";
      const profile = row.profile ? '<p><strong>所属・役職</strong><br>' + renderTextBlock(row.profile).replace(/^<p>|<\/p>$/g, "") + '</p>' : "";
      const talkTitle = row.talk_title ? '<p><strong>講演題目</strong><br>' + renderInline(row.talk_title) + '</p>' : "";
      const abstract = row.abstract ? '<div class="invited-detail__section"><h4>講演要旨</h4>' + renderTextBlock(row.abstract) + '</div>' : "";
      const message = row.message ? '<div class="invited-detail__section"><h4>学生へのメッセージ</h4>' + renderTextBlock(row.message) + '</div>' : "";
      const link = row.link ? '<p class="info-card__link"><a href="' + escapeHtml(row.link) + '">' + renderInline(row.link_label || "関連リンク") + '</a></p>' : "";
      return '<section class="invited-detail" id="' + escapeHtml(anchor) + '"><div class="invited-detail__header">' + image + '<div class="invited-detail__intro"><p class="info-card__eyebrow">' + renderInline(row.category || "招待講演") + '</p><h3>' + renderInline(row.name || row.title || "") + '</h3>' + profile + talkTitle + link + '</div></div>' + abstract + message + '</section>';
    }).join("");

    return '<div class="invited-talks"><div class="card-grid">' + summaryCards + '</div><div class="invited-detail-list">' + detailBlocks + '</div></div>';
  }

  async function renderHomePromo(config) {
    const settings = csvRowsToMap(await fetchCsv(config.source));
    const links = await fetchCsv(config.links);
    const title = settings.title ? "<h2>" + renderInline(settings.title) + "</h2>" : "";
    const body = settings.body ? '<div class="home-promo__body">' + renderTextBlock(settings.body) + "</div>" : "";
    const note = settings.section_note ? '<p class="home-promo__note">' + renderInline(settings.section_note) + "</p>" : "";
    const posterImage = settings.poster_image
      ? '<img class="home-promo__poster-image" src="' + escapeHtml(settings.poster_image) + '" alt="' + escapeHtml(settings.poster_alt || settings.title || "Poster") + '">'
      : "";
    const posterInner = settings.poster_link
      ? '<a class="home-promo__poster-link" href="' + escapeHtml(settings.poster_link) + '">' + posterImage + "</a>"
      : posterImage;
    const posterCaption = settings.poster_caption
      ? '<p class="home-promo__poster-caption">' + renderInline(settings.poster_caption) + "</p>"
      : "";
    const linkList = links.length
      ? '<ul class="home-promo__links">' + links.map(function (row) {
          const noteText = row.note ? '<span class="home-promo__link-note">' + renderInline(row.note) + "</span>" : "";
          return '<li><a class="home-promo__link" href="' + escapeHtml(row.url || "#") + '">' +
            '<span class="home-promo__link-label">' + renderInline(row.label || "") + "</span>" +
            noteText +
          "</a></li>";
        }).join("") + "</ul>"
      : "";

    return '<section class="home-promo">' +
      '<div class="home-promo__main">' + title + body + note + linkList + "</div>" +
      '<aside class="home-promo__poster">' + posterInner + posterCaption + "</aside>" +
      "</section>";
  }

  function renderFaq(rows) {
    return '<div class="faq-list">' + rows.map(function (row) {
      return '<details class="faq-item"><summary>' + renderInline(row.question || "") + '</summary><div class="faq-item__answer">' + renderTextBlock(row.answer || "") + "</div></details>";
    }).join("") + "</div>";
  }

  async function renderPlaceholder(name) {
    const config = PLACEHOLDERS[name];
    if (!config) {
      return '<p class="fetch-error">未定義のブロックです: ' + escapeHtml(name) + "</p>";
    }
    const rows = await fetchCsv(config.source);
    if (config.kind === "timeline") {
      return renderTimeline(rows);
    }
    if (config.kind === "overview") {
      return renderOverviewTable(rows);
    }
    if (config.kind === "table") {
      return renderDataTable(rows, config);
    }
    if (config.kind === "cards") {
      return renderCards(rows);
    }
    if (config.kind === "invited-talks") {
      return renderInvitedTalks(rows);
    }
    if (config.kind === "home-promo") {
      return renderHomePromo(config);
    }
    if (config.kind === "faq") {
      return renderFaq(rows);
    }
    return "";
  }

  async function renderMarkdown(markdown) {
    const blocks = parseMarkdownBlocks(markdown);
    let html = "";
    for (const block of blocks) {
      html += block.type === "placeholder" ? await renderPlaceholder(block.name) : renderMarkdownBlock(block);
    }
    return html;
  }

  function buildNav(page) {
    return '<nav class="site-nav" id="site-nav" aria-label="主要メニュー"><ul class="site-nav__list">' + NAV_ITEMS.map(function (item) {
      const isActive = page.navRoot === item.id || page.id === item.id;
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const submenu = hasChildren
        ? '<ul class="site-nav__submenu"><li><a href="' + item.href + '">' + escapeHtml(item.label) + "</a></li>" + item.children.map(function (child) {
            return '<li><a href="' + child.href + '">' + escapeHtml(child.label) + "</a></li>";
          }).join("") + "</ul>"
        : "";
      const trigger = hasChildren
        ? '<button class="site-nav__link site-nav__trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-label="' + escapeHtml(item.label) + ' のメニューを開く">' + escapeHtml(item.label) + "</button>"
        : '<a class="site-nav__link" href="' + item.href + '">' + escapeHtml(item.label) + "</a>";
      return '<li class="site-nav__item' + (hasChildren ? " site-nav__item--has-children" : "") + (isActive ? " is-active" : "") + '">' + trigger + submenu + "</li>";
    }).join("") + "</ul></nav>";
  }

  function buildHeroLayers() {
    return '<div class="hero__image-layer hero__image-layer--primary is-active" id="hero-image-layer-primary"></div><div class="hero__image-layer hero__image-layer--secondary" id="hero-image-layer-secondary"></div>';
  }

  function buildHero(page) {
    if (page.hero) {
      return '<section class="hero" id="home-hero">' + buildHeroLayers() + '<div class="hero__overlay"><div class="hero__content hero__content--plain"><p class="hero__eyebrow" id="hero-eyebrow">Meteorological Summer School</p><h1 id="hero-title">' +
        escapeHtml(SITE.title) +
        '</h1></div></div></section>';
    }

    return '<section class="hero hero--subpage">' + buildHeroLayers() + '<div class="hero__overlay hero__overlay--subpage"><div class="hero__content hero__content--plain hero__content--subpage"><h1 class="hero__subpage-title">' +
      escapeHtml(page.title) +
      "</h1></div></div></section>";
  }

  function buildBanner(settings) {
    if (!settings.message) {
      return "";
    }

    const message = '<p class="site-banner__message">' + renderInline(settings.message) + "</p>";
    const cta = settings.link
      ? '<a class="site-banner__button" href="' + escapeHtml(settings.link) + '">' + escapeHtml(settings.link_label || "詳細") + "</a>"
      : "";

    return '<div class="site-banner"><div class="site-banner__inner">' + message + cta + "</div></div>";
  }

  function buildShell(page, brandSettings, bannerSettings) {
    const homeIntro = page.hero
      ? '<div class="content-wrap content-wrap--hero-follow"><section class="content-card content-card--home-intro"><div class="home-intro__lead" id="hero-lead"></div><div class="hero__meta hero__meta--below" id="hero-meta"></div></section></div>'
      : "";
    const logoImage = brandSettings.logo_image || "assets/images/site-icon-placeholder.svg";
    const logoAlt = brandSettings.logo_alt || SITE.title;
    const logo = '<span class="site-brand__logo-wrap"><img class="site-brand__logo" src="' + escapeHtml(logoImage) + '" alt="' + escapeHtml(logoAlt) + '"></span>';
    return '<div class="site-shell">' + buildBanner(bannerSettings) + '<header class="site-header"><div class="site-header__inner"><a class="site-brand" href="index.html">' + logo + '<span class="site-brand__text"><span class="site-brand__eyebrow">' + escapeHtml(SITE.subtitle) + '</span><span class="site-brand__title">' + escapeHtml(SITE.title) + '</span></span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="メニューを開閉"><span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span><span class="nav-toggle__label">メニュー</span></button>' + buildNav(page) + '</div></header><main class="site-main site-main--hero">' + buildHero(page) + homeIntro + '<div class="content-wrap"><article class="content-card' + (page.hero ? " content-card--home" : "") + '">' + '<div class="page-content" id="page-content"></div></article></div></main><footer class="site-footer"><div class="site-footer__inner"><p>' + escapeHtml(SITE.title) + '</p><p>このサイトは GitHub Pages の静的配信のみで動作します。</p></div></footer></div>';

  }

  async function renderHeroMeta(page) {
    const heroSettings = csvRowsToMap(await fetchCsv("data/home_hero.csv"));
    const pageHeroRows = await fetchCsv("data/page_hero_images.csv");
    const pageHeroMap = {};
    pageHeroRows.forEach(function (row) {
      if (row.page) {
        pageHeroMap[row.page] = row.image || "";
      }
    });
    const heroImageLayerPrimary = document.getElementById("hero-image-layer-primary");
    const heroImageLayerSecondary = document.getElementById("hero-image-layer-secondary");

    const pageImage = pageHeroMap[page.id] || "";
    const heroImage = pageImage || heroSettings.background_image || "";

    if (heroSlideshowTimer) {
      window.clearInterval(heroSlideshowTimer);
      heroSlideshowTimer = null;
    }

    if (!heroImageLayerPrimary || !heroImageLayerSecondary) {
      return;
    }

    function setLayerImage(layer, image) {
      layer.style.backgroundImage = "url('" + image.replace(/'/g, "%27") + "')";
    }

    if (page.hero) {
      const slideshowImages = [];
      pageHeroRows.forEach(function (row) {
        const image = (row.image || "").trim();
        if (image && slideshowImages.indexOf(image) === -1) {
          slideshowImages.push(image);
        }
      });

      const images = slideshowImages.length ? slideshowImages : (heroImage ? [heroImage] : []);
      if (images.length) {
        let currentIndex = 0;
        let activeLayer = heroImageLayerPrimary;
        let inactiveLayer = heroImageLayerSecondary;
        setLayerImage(activeLayer, images[currentIndex]);
        activeLayer.classList.add("is-active");
        inactiveLayer.classList.remove("is-active");
        if (images.length > 1) {
          heroSlideshowTimer = window.setInterval(function () {
            currentIndex = (currentIndex + 1) % images.length;
            setLayerImage(inactiveLayer, images[currentIndex]);
            inactiveLayer.classList.add("is-active");
            activeLayer.classList.remove("is-active");
            const previousLayer = activeLayer;
            activeLayer = inactiveLayer;
            inactiveLayer = previousLayer;
          }, 3000);
        }
      }
    } else if (heroImage) {
      setLayerImage(heroImageLayerPrimary, heroImage);
      heroImageLayerPrimary.classList.add("is-active");
      heroImageLayerSecondary.classList.remove("is-active");
    }
    if (!page.hero) {
      return;
    }

    const rows = await fetchCsv("data/overview.csv");
    const target = document.getElementById("hero-meta");
    if (!target) {
      return;
    }
    const eyebrow = document.getElementById("hero-eyebrow");
    const title = document.getElementById("hero-title");
    const lead = document.getElementById("hero-lead");
    if (heroSettings.eyebrow && eyebrow) {
      eyebrow.textContent = heroSettings.eyebrow;
    }
    if (heroSettings.title && title) {
      title.textContent = heroSettings.title;
    }
    if (heroSettings.lead && lead) {
      lead.innerHTML = "<p>" + renderInline(heroSettings.lead) + "</p>";
    }

    target.innerHTML = rows.slice(0, 3).map(function (row) {
      return '<div class="hero__meta-item"><span>' + renderInline(row.item || "") + "</span><strong>" + renderInline(row.value || "") + "</strong></div>";
    }).join("");
  }

  function bindNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const triggers = document.querySelectorAll(".site-nav__trigger");

    if (navToggle && siteNav) {
      navToggle.addEventListener("click", function () {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        siteNav.classList.toggle("is-open");
      });
    }

    triggers.forEach(function (button) {
      button.addEventListener("click", function () {
        const item = button.closest(".site-nav__item");
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        if (item) {
          item.classList.toggle("is-open");
        }
      });
    });
  }

  function syncHeaderHeight() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }
    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
  }

  function syncBannerHeight() {
    const banner = document.querySelector(".site-banner");
    document.documentElement.style.setProperty("--banner-height", banner ? banner.offsetHeight + "px" : "0px");
  }

  function syncHeaderTopState() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }
    header.classList.toggle("is-top", window.scrollY <= 4);
  }

  function enhanceHomeChairSection(page) {
    if (!page.hero) {
      return;
    }

    const content = document.getElementById("page-content");
    if (!content) {
      return;
    }

    const headings = Array.from(content.querySelectorAll("h2"));
    const chairHeading = headings.find(function (heading) {
      return heading.textContent.trim() === "校長挨拶";
    });

    if (!chairHeading) {
      return;
    }

    const section = document.createElement("section");
    section.className = "home-chair";

    const media = document.createElement("div");
    media.className = "home-chair__media";

    const body = document.createElement("div");
    body.className = "home-chair__body";

    let current = chairHeading.nextElementSibling;
    while (
      current &&
      current.tagName !== "H2" &&
      !current.classList.contains("home-promo")
    ) {
      const next = current.nextElementSibling;
      if (current.classList.contains("markdown-image")) {
        media.appendChild(current);
      } else {
        body.appendChild(current);
      }
      current = next;
    }

    if (!media.children.length && !body.children.length) {
      return;
    }

    section.appendChild(media);
    section.appendChild(body);
    chairHeading.insertAdjacentElement("afterend", section);
  }

  async function bootstrap() {
    const pageKey = document.body.dataset.page || "home";
    const page = PAGES[pageKey] || PAGES.home;
    document.title = page.title + " | " + SITE.title;
    const brandSettings = csvRowsToMap(await fetchCsv("data/site_brand.csv"));
    const bannerSettings = csvRowsToMap(await fetchCsv("data/site_banner.csv"));

    const root = document.getElementById("site-root");
    root.innerHTML = buildShell(page, brandSettings, bannerSettings);
    bindNav();
    syncBannerHeight();
    syncHeaderHeight();
    syncHeaderTopState();
    window.addEventListener("resize", syncBannerHeight);
    window.addEventListener("resize", syncHeaderHeight);
    window.addEventListener("scroll", syncHeaderTopState, { passive: true });

    try {
      await renderHeroMeta(page);
      const markdown = await fetchText(page.content);
      document.getElementById("page-content").innerHTML = await renderMarkdown(markdown);
      enhanceHomeChairSection(page);
    } catch (error) {
      document.getElementById("page-content").innerHTML = '<p class="fetch-error">' + escapeHtml(error.message) + "</p>";
    }
  }

  window.addEventListener("DOMContentLoaded", bootstrap);
})();
