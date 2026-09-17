/* ==========================================
   MENÚ RESPONSIVE
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


/* ==========================================
   CERRAR MENÚ AL HACER CLIC
========================================== */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });

});


/* ==========================================
   BUSCADOR DE CURSOS
========================================== */

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const courseCards = document.querySelectorAll(".course-card");


function filterCourses() {

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    courseCards.forEach(card => {

        const title = card.dataset.title.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        const matchesSearch =
            title.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


searchInput.addEventListener("input", filterCourses);

categoryFilter.addEventListener("change", filterCourses);


/* ==========================================
   FILTRAR DESDE LAS CATEGORÍAS
========================================== */

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(categoryCard => {

    categoryCard.addEventListener("click", () => {

        const category = categoryCard.dataset.category;

        categoryFilter.value = category;

        filterCourses();

        document.getElementById("cursos").scrollIntoView({
            behavior: "smooth"
        });

        categoryCards.forEach(card => {
            card.classList.remove("active");
        });

        categoryCard.classList.add("active");

    });

});


/* ==========================================
   BOTÓN VOLVER ARRIBA
========================================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* ==========================================
   ANIMACIÓN DE ELEMENTOS
========================================== */

const animatedElements = document.querySelectorAll(
    ".course-card, .diploma-card, .why-card, .process-step, .contact-card"
);


const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);


animatedElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});