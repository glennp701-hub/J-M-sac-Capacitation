const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu?.classList.remove("active");
    });
});

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const courseGrid = document.getElementById("courseGrid");
const diplomaGrid = document.querySelector(".diploma-grid");
const searchBox = document.querySelector(".search-box");

let catalog = [];
let currentResults = [];

const HOME_COURSES_LIMIT = 6;
const HOME_DIPLOMAS_LIMIT = 6;
const SITE_IMAGE_FILES = [
    "WhatsApp Image 2026-03-31 at 7.20.32 PM.jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.10 AM (1).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.10 AM.jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM (1).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM (2).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM (3).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM (4).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM (5).jpeg",
    "WhatsApp Image 2026-09-19 at 7.20.11 AM.jpeg",
    "WhatsApp Image 2026-09-19 at 7.25.08 AM (1).jpeg",
    "WhatsApp Image 2026-09-19 at 7.25.08 AM (2).jpeg",
    "WhatsApp Image 2026-09-19 at 7.25.08 AM (3).jpeg",
    "WhatsApp Image 2026-09-19 at 7.25.08 AM.jpeg",
];

const PROMOTION_IMAGE_FILE =
    "PROMOCION.jpeg";

const PROMOTION_WHATSAPP_MESSAGE =
    "Hola J&M S.A.C., quiero información sobre la promoción anunciada.";

function getCatalogImage(title = "") {
    const normalized = normalizeText(title);
    let hash = 0;

    for (let i = 0; i < normalized.length; i++) {
        hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
    }

    const file =
        SITE_IMAGE_FILES[hash % SITE_IMAGE_FILES.length];

    return "./" + encodeURIComponent(file);
}

function createPromotionAnnouncement() {
    if (document.getElementById("promotionAnnouncement")) return;

    const overlay = document.createElement("div");
    overlay.id = "promotionAnnouncement";
    overlay.innerHTML = `
        <div class="promotion-overlay" role="dialog" aria-modal="true" aria-label="Anuncio promocional">
            <div class="promotion-box">
                <button class="promotion-close" type="button" aria-label="Cerrar anuncio">×</button>
                <a
                    href="https://wa.me/51934995434?text=${encodeURIComponent(PROMOTION_WHATSAPP_MESSAGE)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Consultar promoción por WhatsApp"
                >
                    <img
                        src="${"./" + encodeURIComponent(PROMOTION_IMAGE_FILE)}"
                        alt="Anuncio promocional de J&M S.A.C. - Consultar por WhatsApp"
                        class="promotion-image"
                    >
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".promotion-close")?.addEventListener("click", () => {
        overlay.remove();
    });

    overlay.querySelector(".promotion-overlay")?.addEventListener("click", event => {
        if (event.target.classList.contains("promotion-overlay")) {
            overlay.remove();
        }
    });
}

document.addEventListener("DOMContentLoaded", createPromotionAnnouncement);


function normalizeText(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getIcon(title, type) {
    if (type === "Diplomado") return "🎓";

    const text = normalizeText(title);

    if (/enferm|salud|farmac|pediatr|hospital|uci|clin|quirurg|emergenc|medic|nutric|laboratorio/.test(text)) {
        return "🏥";
    }

    if (/informat|software|sistema|redes|tecnolog|comput|linux|digital|program|web|ciber|datos|base/.test(text)) {
        return "💻";
    }

    if (/marketing|ventas|cliente|publicidad|comunicacion|negoci|comercial/.test(text)) {
        return "📱";
    }

    if (/educacion|docente|ensenanza|aprendizaje|pedagog|profesor|capacitacion/.test(text)) {
        return "📚";
    }

    return "🎯";
}

function whatsappURL(title, type) {
    const label = type === "Diplomado" ? "Diplomado" : "Curso";

    const message =
        `Hola J&M S.A.C., quiero información sobre el ${label}: ${title}.`;

    return `https://wa.me/51934995434?text=${encodeURIComponent(message)}`;
}

function createCourseCard(item) {
    const title = escapeHTML(item.title);
    const icon = getIcon(item.title, item.type);

    return `
        <article
            class="course-card catalog-card"
            data-title="${escapeHTML(normalizeText(item.title))}"
        >
            <div class="course-image catalog-image">
                <img
                    src="${getCatalogImage(item.title)}"
                    alt="${title}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='./WhatsApp%20Image%202026-03-31%20at%207.20.32%20PM.jpeg';"
                >
            </div>

            <div class="course-content">
                <span class="course-category">Curso</span>

                <h3>${title}</h3>

                <p>
                    Programa disponible en el catálogo de J&M S.A.C.
                    Consulta modalidad, duración, certificación y matrícula.
                </p>

                <div class="course-info">
                    <span>📚 Capacitación</span>
                    <span>📜 Certificación</span>
                </div>

                <div class="course-bottom">
                    <strong>Consultar</strong>

                    <a
                        href="${whatsappURL(item.title, item.type)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="course-button"
                    >
                        Ver información
                    </a>
                </div>
            </div>
        </article>
    `;
}

function createDiplomaCard(item) {
    const title = escapeHTML(item.title);

    return `
        <article
            class="diploma-card catalog-card"
            data-title="${escapeHTML(normalizeText(item.title))}"
        >
            <div class="diploma-image">
                <img
                    src="${getCatalogImage(item.title)}"
                    alt="${title}"
                    loading="lazy"
                >
            </div>

            <div>
                <span>DIPLOMADO</span>

                <h3>${title}</h3>

                <p>
                    Programa disponible en el catálogo.
                    Solicita información completa por WhatsApp.
                </p>

                <div class="diploma-details">
                    <span>📚 Capacitación</span>
                    <span>📜 Certificación</span>
                </div>
            </div>

            <a
                href="${whatsappURL(item.title, item.type)}"
                target="_blank"
                rel="noopener noreferrer"
                class="diploma-button"
            >
                Más información
            </a>
        </article>
    `;
}

function createResultsInfo() {
    let element = document.getElementById("searchResultsInfo");

    if (!element) {
        element = document.createElement("div");
        element.id = "searchResultsInfo";

        if (searchBox) {
            searchBox.appendChild(element);
        }
    }

    return element;
}

function getAllItemText(item) {
    const values = Object.values(item || {});

    return normalizeText(
        values
            .filter(value => value !== null && value !== undefined)
            .map(value => {
                if (typeof value === "object") {
                    return JSON.stringify(value);
                }

                return String(value);
            })
            .join(" ")
    );
}

function singularizeWord(word) {
    let result = normalizeText(word);

    if (result.endsWith("es") && result.length > 5) {
        result = result.slice(0, -2);
    } else if (result.endsWith("s") && result.length > 4) {
        result = result.slice(0, -1);
    }

    return result;
}

function levenshteinDistance(a, b) {
    if (a === b) return 0;

    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

const relatedWords = {
    computacion: [
        "computacion",
        "informatica",
        "tecnologia",
        "software",
        "hardware",
        "sistemas",
        "programacion",
        "computadora",
        "digital"
    ],

    informatica: [
        "informatica",
        "computacion",
        "tecnologia",
        "software",
        "sistemas",
        "programacion",
        "redes",
        "digital"
    ],

    redes: [
        "redes",
        "network",
        "networking",
        "cisco",
        "router",
        "switch",
        "servidor",
        "telecomunicaciones",
        "internet"
    ],

    seguridad: [
        "seguridad",
        "ciberseguridad",
        "cybersecurity",
        "proteccion",
        "riesgo",
        "firewall",
        "hacking",
        "informatica"
    ],

    salud: [
        "salud",
        "medicina",
        "enfermeria",
        "farmacia",
        "hospital",
        "clinica",
        "medico",
        "nutricion",
        "laboratorio"
    ],

    medicina: [
        "medicina",
        "salud",
        "medico",
        "hospital",
        "clinica",
        "enfermeria",
        "farmacia"
    ],

    enfermeria: [
        "enfermeria",
        "enfermero",
        "salud",
        "medicina",
        "hospital",
        "clinica",
        "paciente"
    ],

    marketing: [
        "marketing",
        "mercadotecnia",
        "publicidad",
        "ventas",
        "comercial",
        "cliente",
        "digital",
        "redes sociales"
    ],

    ventas: [
        "ventas",
        "marketing",
        "comercial",
        "cliente",
        "negociacion",
        "publicidad",
        "mercadotecnia"
    ],

    administracion: [
        "administracion",
        "gestion",
        "empresa",
        "negocios",
        "gerencia",
        "organizacion",
        "recursos humanos"
    ],

    gestion: [
        "gestion",
        "administracion",
        "gerencia",
        "empresa",
        "organizacion",
        "negocios"
    ],

    contabilidad: [
        "contabilidad",
        "contador",
        "finanzas",
        "tributacion",
        "impuestos",
        "administracion"
    ],

    finanzas: [
        "finanzas",
        "contabilidad",
        "economia",
        "inversion",
        "banca",
        "administracion"
    ],

    educacion: [
        "educacion",
        "docente",
        "profesor",
        "pedagogia",
        "ensenanza",
        "aprendizaje",
        "capacitacion"
    ],

    docente: [
        "docente",
        "profesor",
        "educacion",
        "pedagogia",
        "ensenanza",
        "aprendizaje"
    ],

    recursos: [
        "recursos",
        "recursos humanos",
        "personal",
        "talento",
        "gestion",
        "administracion"
    ],

    humanos: [
        "recursos humanos",
        "personal",
        "talento humano",
        "gestion",
        "administracion"
    ],

    idiomas: [
        "idiomas",
        "ingles",
        "espanol",
        "frances",
        "lenguaje",
        "lengua"
    ],

    ingles: [
        "ingles",
        "idiomas",
        "lenguaje",
        "lengua"
    ],

    excel: [
        "excel",
        "office",
        "hojas de calculo",
        "datos",
        "administracion",
        "contabilidad"
    ],

    liderazgo: [
        "liderazgo",
        "gestion",
        "gerencia",
        "administracion",
        "equipos",
        "direccion"
    ],

    calidad: [
        "calidad",
        "iso",
        "gestion",
        "procesos",
        "auditoria",
        "mejora"
    ],

    proyectos: [
        "proyectos",
        "project",
        "gestion",
        "administracion",
        "planificacion"
    ],

    logistica: [
        "logistica",
        "almacen",
        "inventario",
        "compras",
        "suministros",
        "cadena"
    ]
};

function getRelatedTerms(word) {
    const cleanWord = normalizeText(word);

    if (!cleanWord) return [];

    const terms = new Set();

    terms.add(cleanWord);
    terms.add(singularizeWord(cleanWord));

    Object.keys(relatedWords).forEach(key => {
        const keyNormalized = normalizeText(key);

        if (
            keyNormalized === cleanWord ||
            keyNormalized.includes(cleanWord) ||
            cleanWord.includes(keyNormalized)
        ) {
            relatedWords[key].forEach(term => {
                terms.add(normalizeText(term));
            });
        }
    });

    Object.values(relatedWords).forEach(group => {
        if (
            group.some(term => {
                const normalizedTerm = normalizeText(term);

                return (
                    normalizedTerm === cleanWord ||
                    normalizedTerm.includes(cleanWord) ||
                    cleanWord.includes(normalizedTerm)
                );
            })
        ) {
            group.forEach(term => {
                terms.add(normalizeText(term));
            });
        }
    });

    return [...terms].filter(Boolean);
}

function calculateSearchScore(item, queryWords) {
    if (!queryWords.length) {
        return 0;
    }

    const title = normalizeText(item.title || "");
    const type = normalizeText(item.type || "");
    const fullText = getAllItemText(item);

    const titleWords = title.split(" ").filter(Boolean);
    const fullWords = fullText.split(" ").filter(Boolean);

    let score = 0;
    let matchedWords = 0;

    queryWords.forEach(queryWord => {
        const cleanQuery = normalizeText(queryWord);

        if (!cleanQuery) {
            return;
        }

        const relatedTerms = getRelatedTerms(cleanQuery);

        let bestScore = 0;

        relatedTerms.forEach(term => {
            if (!term) return;

            if (title === term) {
                bestScore = Math.max(bestScore, 100);
            }

            if (title.includes(term)) {
                bestScore = Math.max(bestScore, 80);
            }

            if (type.includes(term)) {
                bestScore = Math.max(bestScore, 50);
            }

            if (fullText.includes(term)) {
                bestScore = Math.max(bestScore, 35);
            }

            titleWords.forEach(titleWord => {
                if (
                    titleWord.startsWith(term) ||
                    term.startsWith(titleWord)
                ) {
                    bestScore = Math.max(bestScore, 65);
                }

                if (
                    titleWord.length >= 4 &&
                    term.length >= 4
                ) {
                    const distance = levenshteinDistance(
                        titleWord,
                        term
                    );

                    const allowedDistance =
                        term.length >= 8 ? 2 : 1;

                    if (distance <= allowedDistance) {
                        bestScore = Math.max(bestScore, 45);
                    }
                }
            });

            fullWords.forEach(fullWord => {
                if (
                    fullWord.startsWith(term) ||
                    term.startsWith(fullWord)
                ) {
                    bestScore = Math.max(bestScore, 25);
                }
            });
        });

        if (bestScore > 0) {
            matchedWords++;
            score += bestScore;
        }
    });

    if (matchedWords === queryWords.length) {
        score += 100;
    }

    return score;
}

function searchCatalog(query) {
    const cleanQuery = normalizeText(query);

    const selectedType =
        categoryFilter?.value || "all";

    if (!cleanQuery) {
        return catalog.filter(item => {
            return (
                selectedType === "all" ||
                normalizeText(item.type) === normalizeText(selectedType)
            );
        });
    }

    const queryWords = cleanQuery
        .split(" ")
        .filter(word => word.length > 0);

    const results = [];

    catalog.forEach(item => {
        const typeMatches =
            selectedType === "all" ||
            normalizeText(item.type) === normalizeText(selectedType);

        if (!typeMatches) {
            return;
        }

        const score = calculateSearchScore(
            item,
            queryWords
        );

        if (score > 0) {
            results.push({
                item,
                score
            });
        }
    });

    results.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }

        return normalizeText(a.item.title)
            .localeCompare(normalizeText(b.item.title));
    });

    return results.map(result => result.item);
}

/* ==========================================
   SOLO 6 CURSOS Y 6 DIPLOMADOS EN INICIO
========================================== */

function getHomeCatalog() {
    const selectedType =
        categoryFilter?.value || "all";

    let courses = catalog.filter(
        item => normalizeText(item.type) === "curso"
    );

    let diplomas = catalog.filter(
        item => normalizeText(item.type) === "diplomado"
    );

    if (selectedType === "Curso") {
        return [
            ...courses.slice(0, HOME_COURSES_LIMIT)
        ];
    }

    if (selectedType === "Diplomado") {
        return [
            ...diplomas.slice(0, HOME_DIPLOMAS_LIMIT)
        ];
    }

    return [
        ...courses.slice(0, HOME_COURSES_LIMIT),
        ...diplomas.slice(0, HOME_DIPLOMAS_LIMIT)
    ];
}

function renderCatalog(results, query = "") {
    if (!courseGrid || !diplomaGrid) {
        return;
    }

    const hasSearch =
        normalizeText(query).length > 0;

    let displayResults = results;

    /*
     * SIN BÚSQUEDA:
     * Solo mostramos 6 cursos y 6 diplomados.
     *
     * CON BÚSQUEDA:
     * Mostramos TODOS los resultados encontrados.
     */
    if (!hasSearch) {
        displayResults = getHomeCatalog();
    }

    const visibleCourses = displayResults.filter(
        item => normalizeText(item.type) === "curso"
    );

    const visibleDiplomas = displayResults.filter(
        item => normalizeText(item.type) === "diplomado"
    );

    courseGrid.innerHTML = visibleCourses.length
        ? visibleCourses.map(createCourseCard).join("")
        : `
            <div class="catalog-empty">
                No se encontraron cursos relacionados con tu búsqueda.
            </div>
        `;

    diplomaGrid.innerHTML = visibleDiplomas.length
        ? visibleDiplomas.map(createDiplomaCard).join("")
        : `
            <div class="catalog-empty">
                No se encontraron diplomados relacionados con tu búsqueda.
            </div>
        `;

    const info = createResultsInfo();

    if (hasSearch) {
        const total = displayResults.length;

        info.innerHTML = total
            ? `
                <strong>${total}</strong>
                resultado${total === 1 ? "" : "s"}
                relacionado${total === 1 ? "" : "s"} con
                "<strong>${escapeHTML(query)}</strong>".
            `
            : `
                No se encontraron resultados relacionados con
                "<strong>${escapeHTML(query)}</strong>".
            `;
    } else {
        info.innerHTML = `
            Mostrando <strong>6 cursos</strong> y
            <strong>6 diplomados</strong> destacados.
        `;
    }

    activateAnimations();
}

function filterCatalog() {
    const rawQuery = searchInput?.value || "";
    const query = normalizeText(rawQuery);

    currentResults = searchCatalog(query);

    renderCatalog(
        currentResults,
        rawQuery.trim()
    );

    return currentResults;
}

function goToResults() {
    const query = searchInput?.value.trim() || "";

    if (!query) {
        filterCatalog();
        return;
    }

    const results = filterCatalog();

    setTimeout(() => {
        const firstResult =
            document.querySelector(".catalog-card");

        if (firstResult) {
            firstResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } else {
            document.getElementById("cursos")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, 200);
}

async function loadCatalog() {
    if (
        !searchInput ||
        !categoryFilter ||
        !courseGrid ||
        !diplomaGrid
    ) {
        return;
    }

    try {
        const response = await fetch("catalogo.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        catalog = await response.json();

        catalog = catalog.filter(item => {
            return (
                item &&
                (
                    normalizeText(item.type) === "curso" ||
                    normalizeText(item.type) === "diplomado"
                )
            );
        });

        categoryFilter.innerHTML = `
            <option value="all">Todos los programas</option>
            <option value="Curso">Cursos</option>
            <option value="Diplomado">Diplomados</option>
        `;

        filterCatalog();

    } catch (error) {
        console.error(
            "No se pudo cargar catalogo.json:",
            error
        );

        createResultsInfo().innerHTML =
            "No se pudo cargar el catálogo. Verifica que catalogo.json esté en la misma carpeta que index.html.";

        courseGrid.innerHTML =
            `
                <div class="catalog-empty">
                    Error al cargar los cursos.
                </div>
            `;

        diplomaGrid.innerHTML =
            `
                <div class="catalog-empty">
                    Error al cargar los diplomados.
                </div>
            `;
    }
}

searchInput?.addEventListener(
    "input",
    () => {
        filterCatalog();
    }
);

searchInput?.addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            goToResults();
        }
    }
);

categoryFilter?.addEventListener(
    "change",
    () => {
        filterCatalog();

        setTimeout(() => {
            document.getElementById("cursos")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }
);

const categoryCards =
    document.querySelectorAll(".category-card");

categoryCards.forEach(categoryCard => {
    categoryCard.addEventListener("click", () => {
        const category =
            categoryCard.dataset.category || "";

        const categoryText =
            category
                .replace(/_/g, " ")
                .replace(/-/g, " ")
                .trim();

        if (searchInput) {
            searchInput.value = categoryText;
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        filterCatalog();

        document.getElementById("cursos")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        categoryCards.forEach(card => {
            card.classList.remove("active");
        });

        categoryCard.classList.add("active");
    });
});

const backToTop =
    document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (!backToTop) {
        return;
    }

    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

let observer;

function activateAnimations() {
    const animatedElements =
        document.querySelectorAll(
            ".course-card, .diploma-card, .why-card, .process-step, .contact-card"
        );

    if (!("IntersectionObserver" in window)) {
        animatedElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform =
                "translateY(0)";
        });

        return;
    }

    observer?.disconnect();

    observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);
    });
}

const catalogStyles =
    document.createElement("style");

catalogStyles.textContent = `
    #searchResultsInfo {
        width: 100%;
        margin-top: 15px;
        font-size: 14px;
        opacity: .85;
    }

    .catalog-empty {
        grid-column: 1 / -1;
        padding: 30px;
        text-align: center;
        border-radius: 14px;
        background: rgba(0,0,0,.04);
    }

    .catalog-card h3 {
        overflow-wrap: anywhere;
    }

    .catalog-card {
        scroll-margin-top: 100px;
    }
`;

document.head.appendChild(catalogStyles);

loadCatalog();
