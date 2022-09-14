///////////////////////////////////////
// Upload for form to add a new meal //
///////////////////////////////////////
const form = document.querySelector("#addMealForm")
const pResultSuccess = document.querySelector("#success-add-meal")
const pResultAlert = document.querySelector("#alert-add-meal")

form.addEventListener("submit", submitForm)

function submitForm(e) {
    e.preventDefault()

    pResultSuccess.innerHTML = ""
    pResultAlert.innerHTML = ""

    // Get data of the form by their id
    const nameMeal = document.querySelector("#name_meal")
    const files = document.querySelector("#files")
    const description = document.querySelector("#description_meal")
    const price = document.querySelector("#price_meal")

    const formData = new FormData()

    // Get only the name of the image "exemple.jpg"
    let imagePath = files.value
    let imageNameSplit = imagePath.split('\\')
    let imageName = imageNameSplit[2]
    
    // Add data to array
    formData.append("name_meal", nameMeal.value)
    formData.append("image_meal", imageName)
    formData.append("files", files.files[0])
    formData.append("description_meal", description.value)
    formData.append("price_meal", price.value)


    let getExtension = imageName.split(".")

    if(getExtension[1] == 'jpeg' || getExtension[1] == 'jpg' || getExtension[1] == 'JPG' || getExtension[1] == 'png'){
        fetch("/update-menu/add-meal", {
            method: 'POST',
            body: formData
        })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
            pResultAlert.innerHTML = `Une erreur s'est produite`
        })

        pResultSuccess.innerHTML = `Le nouveau plat a bien été rajouté ! Allez consulter la page "Menu" pour pouvoir le retrouver.`
    }
    else{
        pResultAlert.innerHTML = `Veuillez choisir une image ayant une extension valide (jpeg, jpg, png)`
    }
}


///////////////////////////////////////////////////////////
// Upload for form to upload new image to existing meal  //
///////////////////////////////////////////////////////////
const form2 = document.querySelector("#uploadImageForm")
const divResultSuccess = document.querySelector("#upload-image-success")
const divResultAlert = document.querySelector("#upload-image-alert")

form2.addEventListener("submit", submitUpload)

function submitUpload(e) {
    e.preventDefault()

    divResultSuccess.innerHTML = ""
    divResultAlert.innerHTML = ""

    const idMeal = document.querySelector("#list_meals_upload")
    const image = document.querySelector("#new_image")

    const formData = new FormData()

    let imagePath = image.value
    let imageNameSplit = imagePath.split('\\')
    let imageName = imageNameSplit[2]
    
    formData.append("id_meal", idMeal.value)
    formData.append("name_new_image", imageName)
    formData.append("image", image.files[0])


    let getExtension = imageName.split(".")

    if(getExtension[1] == 'jpeg' || getExtension[1] == 'jpg' || getExtension[1] == 'JPG' || getExtension[1] == 'png'){
        fetch("/update-menu/upload-image", {
            method: 'POST',
            body: formData
        })
        .then((res) => { 
            console.log(res) 
        })
        .catch((err) => {
            console.log(err)
            divResultAlert.innerHTML = `Une erreur s'est produite`
        })

        divResultSuccess.innerHTML = `L'image a bien été modifiée !`
    }
    else{
        divResultAlert.innerHTML = `Veuillez choisir une image ayant une extension valide (jpeg, jpg, png)`
    }
}