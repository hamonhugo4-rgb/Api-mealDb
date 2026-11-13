const BASE = 'https://rickandmortyapi.com/api'
let cache = null
function nettoyer (perso) {
    return {
        id: perso.id,
        nom: perso.name,
        statut: perso.status,
        espece: perso.species,
        origine: perso.origin.name,
        image: perso.image,
        genre: perso.gender,
        nbEpisodes: perso.episode.length,
        localisation: perso.location.name
    }
}

async function chercher (url) {
    for (let essai = 1; essai <= 5; essai++){
        const response = await fetch(url)

        if (response.ok){
            return response.json()
        }

        if(response.status != 429){
            throw new Error('Response ' + response.status + ' sur ' + url)
        }

        const attente = Number(response.headers.get('retry-after')) || essai * 2
        console.log('429 sur ' + url + ', on attend ' + attente + ' s')
        await new Promise((r) => setTimeout(r, attente * 1000))
    }

    throw new Error('Toujours bloque apres 5 essais sur ' + url)
}


export async function chercherPersonnages () {
    if (cache){
        return cache
    }
    const tous = []
    let url = BASE + '/character'

    while (url) {
        const donnees = await chercher(url)

        for (const perso of donnees.results){
            tous.push(nettoyer(perso))
        }

        url = donnees.info.next
    }
    cache = tous
    return tous
}

export async function chercherUnPersonnage (id) {
    const response = await fetch(BASE + '/character/' + id)

    if (!response.ok) {
        return null
    }

    const perso = await response.json()

    return nettoyer(perso)
}