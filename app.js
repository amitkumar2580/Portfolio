//contact section
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const senderName = document.getElementById("name-form").value;
    const email = document.getElementById("email-form").value;
    const message = document.getElementById("message-form").value;

    try {
      // Construct the Gmail compose link
      const gmailLink =
        "https://mail.google.com/mail/?view=cm&fs=1&to=ramitraj76@gmail.com" +
        "&su=" +
        encodeURIComponent("Contacting from Portfolio") +
        "&body=" +
        encodeURIComponent(
          `From: ${senderName} (${email}) \n\nMessage: ${message}`
        ) +
        "&tf=1";

      // Open Gmail in a new tab or window
      window.open(gmailLink, "_blank");
      alert("Opening Gmail compose window. Please review and send the email.");
    } catch (err) {
      console.error("Error occurred while trying to open Gmail:", err);
      alert("Oops! Something went wrong.");
    }
});

// //captcha
// function onSubmit(token) {
//   document.getElementById("demo-form").submit();
// }
// let url =
//   "https://recaptchaenterprise.googleapis.com/v1/projects/my-portfolio-1-437705/assessments?key=6Lc_P1gqAAAAAHcDjR0cR98lTzc42YGAUVL9dG2H";
// fetch("./request.json") // Update with the actual file path
//   .then((response) => response.json()) // Convert file data to JSON
//   .then((jsonData) => {
//     fetch("https://your-api-url.com/endpoint", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(jsonData), // Send the JSON data
//     })
//       .then((response) => response.json())
//       .then((data) => console.log("Success:", data))
//       .catch((error) => console.error("Error:", error));
// });

//animation only on view screen
document.addEventListener("DOMContentLoaded", function() {
  let animateElements = document.querySelectorAll('.animate');

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

  animateElements.forEach(element => {
    observer.observe(element);
  });
});


//implementing like and page count through Appwrite DB
const client = new Appwrite.Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('6704fa0e002d1c56b9da'); // Your project ID from Appwrite console

const databases = new Appwrite.Databases(client);
const databaseId = "likeCounter";
const collectionId = "likeCount_tracker";  //2nd collection Id
const documentId = "670bfb7c0018487ab942"; // The document that tracks likes

//implementing like button effect
document.addEventListener("DOMContentLoaded", async function() {
  let likeButton = document.querySelector('.like');
  let empty = './assets/heart-outline.png'
  let filled = './assets/heart-fill.png'
  let isEmptyImg = true;
  let isLiked = localStorage.getItem('isLiked')==='true';

  async function fetchDB(){
    try {
      const response = await databases.getDocument(databaseId, collectionId, documentId);
      console.log("Response returned from DB: ", response)
      return response.like_tracker
    } catch (error) {
      console.log("Error fetch data from DB in like function")
    }
  }
  let likeCount = await fetchDB();
  console.log("like count:", likeCount);
  const likeNum = document.getElementById("likeNum")
  likeNum.innerText = `${likeCount}`;

  if(isLiked){
    likeButton.src = filled;
  }else{
    likeButton.src = empty;
  }

  likeButton.addEventListener('click', () =>{
    if(isLiked){
      //Unlike action
      likeButton.src = empty;
      likeCount -= 1;
      likeNum.innerText = `${likeCount}`;
      localStorage.setItem('isLiked', 'false');
      likeButton.classList.remove('clicked')
      console.log("Like count decremented", likeCount)
    }else{
      //Like action
      likeCount += 1;
      likeNum.innerText = `${likeCount}`;
      localStorage.setItem('isLiked', 'true');
      likeButton.src = filled;
      likeButton.classList.add('clicked')
      console.log("Like count incremented", likeCount);
    }
    isLiked = !isLiked;
    updateLikeCount(likeCount);
    void likeButton.offsetWidth;
    isEmptyImg = !isEmptyImg;
  }) 

  async function updateLikeCount(likeCount){
    try {
      await databases.updateDocument(databaseId, collectionId, documentId, {
        like_tracker: likeCount
      });
      console.log("Updated like count in database: ", likeCount)
    } catch (error) {
      console.error("Error updating like count in database:", error)
    }
  }
})

async function incrementPageVisit() {
  try {
    const response = await databases.getDocument(databaseId, collectionId, documentId);
    console.log("Response returned from DB: ", response)
    // Increment the reload count
    const newCount = (response.visit_tracker || 0) + 1;
    //display it on the page
    const pageVisit = document.getElementById('pageVisit')
    pageVisit.innerText = newCount;

    // Update the document with the new reloadCount
    await databases.updateDocument(databaseId, collectionId, documentId, {
      visit_tracker: newCount
    });
    console.log('Reload count updated to:', newCount);
  } catch (error) {
    console.error('Error updating reload count:', error);
  }
}
// Calling the function on page load to increment the counter in body tag
incrementPageVisit()