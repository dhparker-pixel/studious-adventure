/* =========================================================
   DOM REFERENCES
========================================================= */

const yearGroups =
    document.querySelectorAll(".timeline-year-group");

const milestones =
    document.querySelectorAll(".milestone");

const currentYearDisplay =
    document.getElementById("currentYear");

const progressFill =
    document.getElementById("progressFill");

const yearLinks =
    document.querySelectorAll(".timeline-year-link");

const timeline =
    document.querySelector(".timeline");


/* =========================================================
   MILESTONE ENTRANCE ANIMATION
========================================================= */

const milestoneObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


milestones.forEach(milestone => {

    milestoneObserver.observe(milestone);

});


/* =========================================================
   CURRENT YEAR
========================================================= */

let currentYear =
    yearGroups.length
        ? yearGroups[0].dataset.year
        : "";


function updateYear(newYear) {

    if (!newYear || newYear === currentYear) {
        return;
    }


    currentYear = newYear;


    currentYearDisplay.classList.add("changing");


    window.setTimeout(() => {

        currentYearDisplay.textContent =
            newYear;

        currentYearDisplay.classList.remove(
            "changing"
        );

    }, 180);


    yearLinks.forEach(link => {

        const target =
            document.getElementById(
                link.dataset.target
            );


        if (!target) {
            return;
        }


        const linkYear =
            target.dataset.year;


        link.classList.toggle(
            "active",
            linkYear === newYear
        );

    });

}


/* =========================================================
   DETERMINE ACTIVE YEAR
========================================================= */

function determineCurrentYear() {

    if (!yearGroups.length) {
        return;
    }


    /*
       Point in the viewport where a year becomes active.
       42% feels natural because the new year changes shortly
       before the section reaches the center of the screen.
    */

    const viewportPoint =
        window.innerHeight * 0.42;


    let activeYear =
        yearGroups[0].dataset.year;


    yearGroups.forEach(group => {

        const rect =
            group.getBoundingClientRect();


        if (rect.top <= viewportPoint) {

            activeYear =
                group.dataset.year;

        }

    });


    updateYear(activeYear);

}


/* =========================================================
   TIMELINE PROGRESS
========================================================= */

function updateProgress() {

    if (!timeline) {
        return;
    }


    const rect =
        timeline.getBoundingClientRect();


    const timelineHeight =
        timeline.offsetHeight;


    const viewportHeight =
        window.innerHeight;


    const distance =
        -rect.top +
        (viewportHeight * 0.35);


    const maxDistance =
        timelineHeight -
        (viewportHeight * 0.4);


    let progress =
        maxDistance > 0
            ? distance / maxDistance
            : 0;


    progress =
        Math.max(
            0,
            Math.min(1, progress)
        );


    if (window.innerWidth <= 850) {

        progressFill.style.width =
            `${progress * 100}%`;

        progressFill.style.height =
            "100%";

    }

    else {

        progressFill.style.height =
            `${progress * 100}%`;

        progressFill.style.width =
            "100%";

    }

}


/* =========================================================
   YEAR NAVIGATION
========================================================= */

yearLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            const target =
                document.getElementById(
                    link.dataset.target
                );


            if (!target) {
                return;
            }


            const reduceMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;


            target.scrollIntoView({

                behavior:
                    reduceMotion
                        ? "auto"
                        : "smooth",

                block: "start"

            });

        }
    );

});


/* =========================================================
   SCROLL HANDLING
========================================================= */

let scrollTicking = false;


function handleScroll() {

    if (scrollTicking) {
        return;
    }


    scrollTicking = true;


    window.requestAnimationFrame(() => {

        determineCurrentYear();

        updateProgress();

        scrollTicking = false;

    });

}


/* =========================================================
   EVENTS
========================================================= */

window.addEventListener(
    "scroll",
    handleScroll,
    {
        passive: true
    }
);


window.addEventListener(
    "resize",
    () => {

        determineCurrentYear();

        updateProgress();

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

milestones.forEach(milestone => {

    const rect =
        milestone.getBoundingClientRect();


    if (rect.top < window.innerHeight) {

        milestone.classList.add("visible");

    }

});


determineCurrentYear();

updateProgress();
