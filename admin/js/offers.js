async function loadRequests() {
    const res = await fetch("/api/requests");
    const requests = await res.json();

    const tbody = document.getElementById("offersTable");

    tbody.innerHTML = "";

    requests.forEach(r => {

        tbody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>${r.email}</td>
            <td>${r.phone}</td>
            <td>${r.service}</td>
            <td>
                <button onclick="deleteRequest(${r.id})">
                    Избриши
                </button>
            </td>
        </tr>
        `;

    });
}

async function deleteRequest(id){

    if(!confirm("Избриши ја понудата?")) return;

    await fetch("/api/delete-request",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({id})

    });

    loadRequests();

}

loadRequests();