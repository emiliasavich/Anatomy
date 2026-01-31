document.addEventListener("DOMContentLoaded", () => addViewButtonFunctionality(document));

function addViewButtonFunctionality(container) {
    container.querySelectorAll('.view-buttons').forEach(buttonContainer => {
        const buttons = buttonContainer.querySelectorAll('.view-btn');
        const viewContainer = buttonContainer.previousElementSibling; // get the image container just above
        const hoverableContainers = viewContainer.querySelectorAll('.hoverable-image-container');

        // create dictionary mapping view to button and container {anterior: {button: <button...>, container: <div...>}, ...}
        const viewMap = createViewDict(buttons, hoverableContainers);

        // store active button
        // let activeButton = Array.from(buttons).find(btn => btn.classList.contains('active'));
        // let activeView = activeButton?.dataset.view;

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (isDrag(e)) return;
                e.stopPropagation();
                let newActiveView = btn.dataset.view;

                // go up to shared container
                const shared_container = btn.closest(".shared-image-container");
                const circles = shared_container.querySelectorAll('.hoverable-circle');

                // Toggle active button
                // removeActiveContainer(viewMap, activeView);
                // addActiveContainer(viewMap, newActiveView);
                changeActiveContainer(viewMap, newActiveView);
                changeHoverCircle(newActiveView, circles);

                // activeView = newActiveView;
            });
        });
    });
}

function createViewDict(buttons, hoverableContainers) {
    const viewMap = {};
    buttons.forEach(button => {  // Loop through buttons
        const view = button.dataset.view; // assuming <button data-view="anterior">
        if (!viewMap[view]) {
            viewMap[view] = { button: null, container: null };
        }
        viewMap[view].button = button;
    });
    hoverableContainers.forEach(div => { // Loop through hoverable containers
        const view = div.dataset.view; // assuming <div data-view="anterior">
        viewMap[view].container = div;
    });
    return viewMap;
}

// function removeActiveContainer(viewMap, active) {
//     viewMap[active]['button'].classList.remove('active');
//     viewMap[active]['container'].classList.remove('active');
// }

// function addActiveContainer(viewMap, active) {
//     viewMap[active]['button'].classList.add('active');
//     viewMap[active]['container'].classList.add('active');
// }

function changeActiveContainer(viewMap, new_active) {
    // get prev active view
    const prev_active = Object.entries(viewMap).find(([viewName, viewObj]) =>
        viewObj.button.classList.contains("active")
    )?.[0];

    viewMap[prev_active]['button'].classList.remove('active');
    viewMap[prev_active]['container'].classList.remove('active');

    viewMap[new_active]['button'].classList.add('active');
    viewMap[new_active]['container'].classList.add('active');
}

function changeHoverCircle(new_view, circles) {
    const activeCircles = Array.from(circles).filter(circle =>
        circle.classList.contains('show')
    );

    activeCircles.forEach(circle => {
        circle.classList.remove('show');
    });

    const newCircles = Array.from(circles).filter(circle =>
        circle.classList.contains(new_view)
    );

    newCircles.forEach(circle => {
        circle.classList.add('show');
    });
}
