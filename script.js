document.addEventListener("DOMContentLoaded", function () {

    /* 1. Mobile Navigation */
    const header = document.querySelector(".header");
    const nav = document.querySelector("nav");

    if (header && nav) {
        const menu = document.createElement("button");
        menu.innerHTML = "☰";
        menu.setAttribute("aria-label", "Open navigation");
        menu.style.cssText =
            "display:none;border:0;background:#f39a12;color:#092c47;" +
            "font-size:24px;padding:7px 12px;cursor:pointer;border-radius:4px;";

        header.insertBefore(menu, nav);

        menu.addEventListener("click", function () {
            nav.classList.toggle("js-nav-open");
        });

        const style = document.createElement("style");
        style.textContent = `
            @media(max-width:850px){
                .header button{display:block !important}
                nav.js-nav-open{
                    display:flex !important;
                    flex-direction:column;
                    width:100%;
                    align-items:center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /* 2. Active Navigation */
    const page = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(function (link) {
        if (link.getAttribute("href") === page) {
            document.querySelectorAll("nav a").forEach(function (a) {
                a.classList.remove("active");
            });
            link.classList.add("active");
        }
    });

    /* 3. Smooth Scrolling */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* 4. Back To Top */
    const top = document.createElement("button");
    top.textContent = "↑";
    top.title = "Back to top";
    top.style.cssText =
        "position:fixed;right:22px;bottom:22px;width:46px;height:46px;" +
        "border:0;border-radius:50%;background:#f39a12;color:#092c47;" +
        "font-size:22px;font-weight:bold;cursor:pointer;z-index:2000;display:none;";

    document.body.appendChild(top);

    window.addEventListener("scroll", function () {
        top.style.display = window.scrollY > 350 ? "block" : "none";
    });

    top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* 5. Destination Search */
    const destinationGrid = document.querySelector(".destination-page");

    if (destinationGrid) {
        const heading = document.querySelector(".section-heading");

        if (heading) {
            const search = document.createElement("input");
            search.type = "search";
            search.placeholder = "Search destinations...";
            search.style.cssText =
                "display:block;width:min(500px,100%);margin:0 auto 35px;" +
                "padding:14px 18px;border:1px solid #ddd;background:#fff;" +
                "font:inherit;outline:none;";

            heading.insertAdjacentElement("afterend", search);

            search.addEventListener("input", function () {
                const value = this.value.toLowerCase();

                document.querySelectorAll(".destination-card").forEach(function (card) {
                    card.style.display =
                        card.textContent.toLowerCase().includes(value) ? "" : "none";
                });
            });
        }
    }

    /* 6. Destination Card Interaction */
    document.querySelectorAll(".destination-card").forEach(function (card) {
        card.addEventListener("click", function (event) {
            if (event.target.closest("a")) return;

            const title = card.querySelector("h3");

            if (title) {
                const userChoice = confirm(
                    "You selected " + title.textContent + ". Do you want to continue to the Contact page?"
                );

                if (userChoice) {
                    window.location.href = "contact.html";
                }
            }
        });
    });

    /* 7. Package Booking */
    document.querySelectorAll(".package-card .btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".package-card");
            const title = card && card.querySelector("h3");

            if (title) {
                localStorage.setItem(
                    "selectedPackage",
                    title.textContent.trim()
                );
            }
        });
    });

    /* 8. Package Price Calculator */
    document.querySelectorAll(".package-card").forEach(function (card) {
        const priceElement = card.querySelector(".price");
        const content = card.querySelector(".package-content");

        if (!priceElement || !content) return;

        const match = priceElement.textContent.replace(/,/g, "").match(/\d+/);
        if (!match) return;

        const basePrice = parseInt(match[0]);

        const box = document.createElement("div");
        box.innerHTML = `
            <label style="display:block;margin-top:15px;font-weight:bold;font-size:13px;">
                Number of People
            </label>
            <input type="number" min="1" value="1"
                   style="width:100%;padding:10px;border:1px solid #ddd;margin-top:6px;">
            <p class="total-price"
               style="font-weight:bold;color:#0d4266;margin-top:10px;">
                Total: ₹${basePrice.toLocaleString("en-IN")}
            </p>
        `;

        const list = content.querySelector("ul");
        content.insertBefore(box, list);

        const input = box.querySelector("input");
        const total = box.querySelector(".total-price");

        input.addEventListener("input", function () {
            let people = parseInt(this.value);

            if (!people || people < 1) {
                people = 1;
                this.value = 1;
            }

            total.textContent =
                "Total: ₹" + (basePrice * people).toLocaleString("en-IN");
        });
    });

    /* 9. Contact Form Validation */
    const form = document.querySelector(".form-box form");

    if (form) {
        const name = form.querySelector('input[type="text"]');
        const email = form.querySelector('input[type="email"]');
        const destination = form.querySelector("select");
        const message = form.querySelector("textarea");
        const button = form.querySelector(".btn");

        const status = document.createElement("p");
        status.style.cssText =
            "margin-top:15px;font-size:14px;font-weight:600;";
        form.appendChild(status);

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (
                !name.value.trim() ||
                !email.value.trim() ||
                destination.value === "Select a destination" ||
                !message.value.trim()
            ) {
                status.textContent = "Please fill in all the fields.";
                status.style.color = "#b23b3b";
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {
                status.textContent = "Please enter a valid email address.";
                status.style.color = "#b23b3b";
                return;
            }

            localStorage.setItem("visitorName", name.value.trim());

            status.textContent =
                "Thank you, " + name.value.trim() +
                "! Your message has been sent successfully.";
            status.style.color = "#0d4266";

            button.textContent = "Message Sent ✓";

            setTimeout(function () {
                form.reset();
                button.textContent = "Send Message";
            }, 2500);
        });

        /* 10. Character Counter */
        const counter = document.createElement("small");
        counter.textContent = "0 characters";
        counter.style.cssText =
            "display:block;text-align:right;color:#777;margin-top:5px;";

        message.insertAdjacentElement("afterend", counter);

        message.addEventListener("input", function () {
            counter.textContent = this.value.length + " characters";
        });
    }

    /* 11. Travel Tips Interaction */
    document.querySelectorAll(".tip-card").forEach(function (card) {
        card.addEventListener("click", function () {
            const heading = card.querySelector("h3");

            if (heading) {
                const old = heading.textContent;
                heading.textContent = "✓ " + old;

                setTimeout(function () {
                    heading.textContent = old;
                }, 1000);
            }
        });
    });

    /* 12. Image Error Handling */
    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            this.alt = "WanderWay travel image";
            this.style.backgroundColor = "#ddd";
        });
    });

    /* 13. Scroll Reveal */
    const items = document.querySelectorAll(
        ".destination-card,.package-card,.tip-card,.feature-card,.gallery-item"
    );

    const revealStyle = document.createElement("style");
    revealStyle.textContent = `
        .js-reveal{
            opacity:0;
            transform:translateY(25px);
            transition:opacity .6s ease,transform .6s ease;
        }
        .js-visible{
            opacity:1;
            transform:translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);

    items.forEach(function (item) {
        item.classList.add("js-reveal");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("js-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        items.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        items.forEach(function (item) {
            item.classList.add("js-visible");
        });
    }

    /* 14. Current Year */
    document.querySelectorAll(".copyright").forEach(function (copyright) {
        copyright.innerHTML =
            "© " + new Date().getFullYear() +
            " WanderWay. All Rights Reserved.";
    });

    /* 15. Visitor Greeting */
    const savedName = localStorage.getItem("visitorName");

    if (savedName && document.querySelector(".hero-content")) {
        const greeting = document.createElement("p");
        greeting.textContent = "Welcome back, " + savedName + "!";
        greeting.style.cssText =
            "font-weight:700;color:#f39a12;margin-bottom:10px;";

        const smallTitle =
            document.querySelector(".hero-content .small-title");

        if (smallTitle) {
            smallTitle.insertAdjacentElement("beforebegin", greeting);
        }
    }

    /* 16. Lazy Loading */
    document.querySelectorAll("img").forEach(function (image) {
        if (!image.hasAttribute("loading")) {
            image.setAttribute("loading", "lazy");
        }
    });

});
