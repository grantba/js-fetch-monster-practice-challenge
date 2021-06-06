document.addEventListener("DOMContentLoaded", () => {
    const monsterForm = document.querySelector("#create-monster");
    const monsterContainer = document.querySelector("#monster-container");
    const backButton = document.querySelector("#back");
    const forwardButton = document.querySelector("#forward");
    
    function getMonsters(url) {
        fetch(url)
        .then(resp => resp.json())
        .then(monsters => createMonsters(monsters))
    }

    let page = 1;
    getMonsters(`http://localhost:3000/monsters/?_limit=50&_page=${page}`);

    function createMonsters(monsters) {
        monsterList = monsters.map(monster => {
            const div = document.createElement('div');
            div.id = monster.id;
            div.innerHTML = `
            <h2 data-id="monster-name">${monster.name}</h2>
            <h4>Age: ${monster.age}</h4>
            <p>Bio: ${monster.description}</p>
            <br><button data-id="delete-button">Delete</button><br><br>`
            return div;
        })
        addMonstersOnPageLoad(monsterList);
    }

    function addMonstersOnPageLoad(monsterList) {
        monsterList.forEach(monster => {
            monsterContainer.appendChild(monster);
        })
        // .slice(0, 50)
    }

    function addFormOnPageLoad() {
        const form = document.createElement("form");
        form.id = "monster-form";
        form.innerHTML = `<form>
        <input id="name" placeholder="name...">
        <input id="age" placeholder="age...">
        <input id="description" placeholder="description..."><br>
        <br><button>Create</button><br>
        </form>`
        monsterForm.appendChild(form);
        form.addEventListener("submit", (event) => {
        event.preventDefault();
        addNewMonster(event);
        })
    }

    addFormOnPageLoad();

    backButton.addEventListener("click", event => {
        if (event.target.previousSibling.previousSibling.childElementCount === 0) {
            page -= 1;
            monsterContainer.innerHTML = "";
            getMonsters(`http://localhost:3000/monsters/?_limit=50&_page=${page}`);
        }
        else if (event.target.previousSibling.previousSibling.firstElementChild.id === "1") {
            alert("Aint no monsters here")
        }
        else {
            page -= 1;
            monsterContainer.innerHTML = "";
            getMonsters(`http://localhost:3000/monsters/?_limit=50&_page=${page}`);
        }
    })

    forwardButton.addEventListener("click", (event) => {
        if (event.target.previousSibling.previousSibling.previousSibling.previousSibling.childElementCount === 0) {
            alert("Aint no monsters here")
            monsterContainer.innerHTML = "";
            getMonsters(`http://localhost:3000/monsters/?_limit=50&_page=${page}`);
        }
        else {
            page += 1;
            monsterContainer.innerHTML = "";
            getMonsters(`http://localhost:3000/monsters/?_limit=50&_page=${page}`);
        }
    })

    function addNewMonster(event) {
        const div = document.createElement('div');
        const form = document.getElementById("monster-form");

        const data = {
        name: event.target.name.value,
        age: event.target.age.value,
        description: event.target.description.value
        }

        form.reset();    

        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch("http://localhost:3000/monsters", options)
        .then(resp => resp.json())
        .then(monster => {
            alert("Your new monster has been created!")
            showMonster(monster)
        })        
    }

    function showMonster(monster) {
        monsterContainer.innerHTML = "";
        const div = document.createElement('div');
        div.id = monster.id;
        div.innerHTML = `
        <h2 data-id="monster-name">${monster.name}</h2>
        <h4>Age: ${monster.age}</h4>
        <p>Bio: ${monster.description}</p>
        <br><button data-id="delete-button">Delete</button><br><br>`
        monsterContainer.appendChild(div);
    }

    monsterContainer.addEventListener("click", (event) => {
        if (event.target.dataset.id === "delete-button") {
            const name = event.target.parentElement.querySelector("h2").innerText;
            const element = event.target.parentElement;
            const id = element.id;
            alert(`${name} is being deleted from this list of monsters.`)
            if (document.querySelector("#monster-container").childElementCount === 1) {
                element.remove();
                getMonsters();
            }
            else {
                element.remove();
            }
        }
        if (event.target.dataset.id === "monster-name") {
            const id = event.target.parentElement.id;
            findMonster(id);
        }
    })

    function deleteMonster(id) {
        // would send a post request, method delete, to delete this mosnter (by id)
    }

    function findMonster(id) {
        fetch(`http://localhost:3000/monsters/${id}`)
        .then(resp => resp.json())
        .then(monster => showMonster(monster))
    }

})