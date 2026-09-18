```javascript
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

function normalizeText(value = "") {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function escapeHTML(value = "") {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getIcon(title, type) {
    if (type === "Diplomado") return "🎓";

    const text = normalizeText(title);

    if (/enferm|salud|farmac|pediatr|hospital|uci|clin|quirurg|emergenc|medic|nutric|laboratorio/.test(text)) return "🏥";
    if (/informat|software|sistema|redes|tecnolog|comput|linux|digital/.test(text)) return "💻";
    if (/marketing|ventas|cliente|publicidad|comunicacion/.test(text)) return "📱";
    if (/educacion|docente|enseñanza|aprendizaje|pedagog/.test(text)) return "📚";

    return "🎯";
}

function whatsappURL(title, type) {
    const label = type === "Diplomado" ? "Diplomado" : "Curso";
    const message = `Hola J&M S.A.C., quiero información sobre el ${label}: ${title}.`;

    return `https://wa.me/51934995434?text=${encodeURIComponent(message)}`;
}

function createCourseCard(item) {
    const title = escapeHTML(item.title);
    const icon = getIcon(item.title, item.type);

    return `
        <article class="course-card catalog-card" data-title="${escapeHTML(normalizeText(item.title))}">
            <div class="course-image health">
                ${icon}
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
        <article class="diploma-card catalog-card" data-title="${escapeHTML(normalizeText(item.title))}">
            <div class="diploma-icon">🎓</div>

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

function renderCatalog(results, query = "") {
    if (!courseGrid || !diplomaGrid) return;

    const maxResults = query ? 80 : 12;

    const visibleCourses = results
        .filter(item => item.type === "Curso")
        .slice(0, maxResults);

    const visibleDiplomas = results
        .filter(item => item.type === "Diplomado")
        .slice(0, maxResults);

    courseGrid.innerHTML = visibleCourses.length
        ? visibleCourses.map(createCourseCard).join("")
        : `<div class="catalog-empty">No se encontraron cursos para esta búsqueda.</div>`;

    diplomaGrid.innerHTML = visibleDiplomas.length
        ? visibleDiplomas.map(createDiplomaCard).join("")
        : `<div class="catalog-empty">No se encontraron diplomados para esta búsqueda.</div>`;

    const info = createResultsInfo();
    const total = results.length;

    if (query) {
        const shown = visibleCourses.length + visibleDiplomas.length;

        info.innerHTML = `
            <strong>${total}</strong>
            resultado${total === 1 ? "" : "s"}
            encontrado${total === 1 ? "" : "s"}.
            ${shown < total ? `Mostrando ${shown}.` : ""}
        `;
    } else {
        info.innerHTML = `
            Catálogo cargado:
            <strong>${catalog.length}</strong>
            registros.
            Escribe el nombre o una palabra clave para buscar.
        `;
    }

    activateAnimations();
}

function filterCatalog() {
    const rawQuery = searchInput?.value || "";
    const query = normalizeText(rawQuery);
    const queryWords = query.split(" ").filter(Boolean);
    const selectedType = categoryFilter?.value || "all";

    currentResults = catalog.filter(item => {
        const typeMatches =
            selectedType === "all" ||
            normalizeText(item.type) === normalizeText(selectedType);

        const searchable =
            normalizeText(`${item.title} ${item.type}`);

        const searchMatches =
            queryWords.length === 0 ||
            queryWords.every(word => searchable.includes(word));

        return typeMatches && searchMatches;
    });

    renderCatalog(currentResults, query);

    return currentResults;
}

function goToResults() {
    const results = filterCatalog();

    if (!searchInput || !searchInput.value.trim()) {
        return;
    }

    setTimeout(() => {
        const firstResult = document.querySelector(".catalog-card");

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
    }, 150);
}

async function loadCatalog() {
    if (!searchInput || !categoryFilter || !courseGrid || !diplomaGrid) {
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

        const uniqueTypes = [
            ...new Set(catalog.map(item => item.type))
        ];

        categoryFilter.innerHTML = `
            <option value="all">Todos los programas</option>
            ${uniqueTypes.map(type => `
                <option value="${type}">${type}s</option>
            `).join("")}
        `;

        filterCatalog();

    } catch (error) {
        console.error("No se pudo cargar catalogo.json:", error);

        createResultsInfo().innerHTML =
            "No se pudo cargar el catálogo. Verifica que catalogo.json esté en la misma carpeta que index.html.";

        courseGrid.innerHTML =
            `<div class="catalog-empty">Error al cargar los cursos.</div>`;

        diplomaGrid.innerHTML =
            `<div class="catalog-empty">Error al cargar los diplomados.</div>`;
    }
}

searchInput?.addEventListener("input", filterCatalog);

searchInput?.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        goToResults();
    }
});

categoryFilter?.addEventListener("change", filterCatalog);

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(categoryCard => {
    categoryCard.addEventListener("click", () => {
        const category = categoryCard.dataset.category || "";

        if (searchInput) {
            searchInput.value = category.replace("_", " ");
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        filterCatalog();

        document.getElementById("cursos")?.scrollIntoView({
            behavior: "smooth"
        });

        categoryCards.forEach(card => {
            card.classList.remove("active");
        });

        categoryCard.classList.add("active");
    });
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (!backToTop) return;

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
    const animatedElements = document.querySelectorAll(
        ".course-card, .diploma-card, .why-card, .process-step, .contact-card"
    );

    if (!("IntersectionObserver" in window)) {
        animatedElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });

        return;
    }

    observer?.disconnect();

    observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);
    });
}

const catalogStyles = document.createElement("style");

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
`;

document.head.appendChild(catalogStyles);

loadCatalog();
```
