let templates = [
    {
        name: "Engagement photography",
        terms: "Edited photographs delivered within four weeks.",
        items: [
            { name: "Engagement filming", type: "Service", description: "One session of filming", qty: 1, price: 1200 },
            { name: "Edited highlight film", type: "Deliverable", description: "Private digital gallery", qty: 1, price: 200 },
            { name: "Photo album", type: "Deliverable", description: "Printed album", qty: 1, price: 150 }
        ]
    },
    {
        name: "Wedding photography",
        terms: "50% advance to confirm the date. Balance on the wedding day.",
        items: [
            { name: "Wedding day coverage", type: "Service", description: "8 hours, 2 photographers", qty: 1, price: 2500 },
            { name: "Pre-wedding shoot", type: "Service", description: "Half day outdoor shoot", qty: 1, price: 600 },
            { name: "Wedding album", type: "Deliverable", description: "40 page premium album", qty: 2, price: 300 }
        ]
    },
    {
        name: "Individual Events",
        terms: "Photos delivered within two weeks of the event.",
        items: [
            { name: "Event photography", type: "Service", description: "Per hour coverage", qty: 4, price: 150 },
            { name: "Edited photos", type: "Deliverable", description: "Online gallery, high resolution", qty: 1, price: 100 }
        ]
    }
];

let items = [];
let selected = "";

let fields = ["number", "date", "validTill", "fromName", "fromEmail", "fromPhone",
              "clientName", "clientEmail", "eventName", "eventDate", "venue",
              "notes", "terms"];

function money(n) {
    let c = document.getElementById("in_currency").value;
    return c + n.toFixed(2);
}

// template buttons
function showTemplates() {
    let box = document.getElementById("tempbox");
    box.innerHTML = "";
    for (let i = 0; i < templates.length; i++) {
        let cls = "temp border";
        if (templates[i].name == selected) {
            cls = cls + " tempactive";
        }
        box.innerHTML += '<div class="' + cls + '" onclick="useTemplate(' + i + ')">' + templates[i].name + '</div>';
    }
}

function useTemplate(i) {
    let t = templates[i];
    selected = t.name;
    document.getElementById("in_eventName").value = t.name;
    document.getElementById("in_terms").value = t.terms;
    // copy the items so the template does not change
    items = [];
    for (let item of t.items) {
        items.push({ ...item });
    }
    showTemplates();
    showItemForm();
    update();
}

// items
function qtyPlaceholder(type) {
    if (type == "Service") {
        return "No. of hours";
    }
    return "No. of deliverables";
}

function pricePlaceholder(type) {
    if (type == "Service") {
        return "Price per hour";
    }
    return "Price per deliverable";
}

function changeType(select) {
    let box = select.closest(".itembox");
    box.querySelector(".f_qty").placeholder = qtyPlaceholder(select.value);
    box.querySelector(".f_price").placeholder = pricePlaceholder(select.value);
}

function showItemForm() {
    let list = document.getElementById("itemlist");
    list.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        list.innerHTML += `
            <div class="itembox">
                <input class="inp f_name" placeholder="Item name" value="${item.name}">
                <input class="inp f_desc" placeholder="Description" value="${item.description}">
                <select class="inp f_type" onchange="changeType(this)">
                    <option ${item.type == "Service" ? "selected" : ""}>Service</option>
                    <option ${item.type == "Deliverable" ? "selected" : ""}>Deliverable</option>
                </select>
                <div class="itemrow">
                    <input class="inp f_qty" type="number" placeholder="${qtyPlaceholder(item.type)}" value="${item.qty}">
                    <input class="inp f_price" type="number" placeholder="${pricePlaceholder(item.type)}" value="${item.price}">
                    <div class="remove" onclick="removeItem(${i})">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </div>`;
    }
}

function addItem() {
    readItems();
    items.push({ name: "", type: "Service", description: "", qty: "", price: "" });
    showItemForm();
    update();
}

function removeItem(i) {
    readItems();
    items.splice(i, 1);
    showItemForm();
    update();
}

function readItems() {
    let boxes = document.querySelectorAll(".itembox");
    items = [];
    for (let box of boxes) {
        items.push({
            name: box.querySelector(".f_name").value,
            description: box.querySelector(".f_desc").value,
            type: box.querySelector(".f_type").value,
            qty: Number(box.querySelector(".f_qty").value),
            price: Number(box.querySelector(".f_price").value)
        });
    }
}

// update previw
function update() {
    readItems();

    for (let f of fields) {
        document.getElementById("out_" + f).innerText = document.getElementById("in_" + f).value;
    }

    let notes = document.getElementById("in_notes").value;
    let terms = document.getElementById("in_terms").value;
    document.getElementById("notesbox").classList.toggle("hide", notes == "");
    document.getElementById("termsbox").classList.toggle("hide", terms == "");

    let rows = document.getElementById("rows");
    rows.innerHTML = "";
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let amount = item.qty * item.price;
        total = total + amount;
        rows.innerHTML += `
            <tr>
                <td class="itemcol">
                    <p class="iname">${i + 1}. ${item.name}</p>
                    <p class="idesc">${item.type} - ${item.description}</p>
                </td>
                <td>${item.qty}</td>
                <td>${money(item.price)}</td>
                <td>${money(amount)}</td>
            </tr>`;
    }

    // totals
    let discount = Number(document.getElementById("in_discount").value);
    let afterDiscount = total - discount;
    //rounding off
    let rounding = Math.floor(afterDiscount) - afterDiscount;
    let grand = afterDiscount + rounding;

    document.getElementById("itemsTotal").innerText = money(total);
    document.getElementById("discountOut").innerText = "-" + money(discount);
    document.getElementById("rounding").innerText = money(rounding);
    document.getElementById("grandTotal").innerText = money(grand);
}

showTemplates();
update();