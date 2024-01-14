/*connect to the indexDB*/
let db;
let cardCount = 0;
const DBOpenRequest = window.indexedDB.open("flashCards", 4);
DBOpenRequest.onerror = (event) => {
  console.log("DBOpenRequest Error", event);
};

DBOpenRequest.onsuccess = (event) => {
  console.log("DBOpenRequest Successfull", event);
  db = DBOpenRequest.result;
  displayFlashCards();
};

// This event handles the event whereby a new version of the database needs to be created
// Either one has not been created before, or a new version number has been submitted via the
DBOpenRequest.onupgradeneeded = (event) => {
  db = event.target.result;

  db.onerror = (event) => {
    console.log("Error loading database.");
  };

  // Create an objectStore for this database
  const objectStore = db.createObjectStore("flashCards", {
    autoIncrement: true,
  });
  objectStore.createIndex("subject", "subject", { unique: false });
  objectStore.createIndex("question", "question", { unique: false });
  objectStore.createIndex("answer", "answer", { unique: false });
  objectStore.createIndex("difficulty", "difficulty", { unique: false });
  objectStore.createIndex("tag", "tag", { unique: false });
  objectStore.createIndex("Created", "Created", { unique: false });
};

const displayFlashCards = () => {
  let count = 0;
  const transaction = db.transaction(["flashCards"], "readonly");
  const objectStore = transaction.objectStore("flashCards");
  //open the cursor to loop over
  const cursorRequest = objectStore.openCursor();
  cursorRequest.onsuccess = (event) => {
    console.log("in success cursorRequest ");
    const cursor = event.target.result;
    if (!cursor) {
      console.log("No cursor found");
      if (!document.getElementById("gridViewBody")?.children)
        displayEmptyFlashCards();
      return;
    }
    if (cursor?.value && count===0) {
        count++;
      createGridView();
    }

    //loop through the each cursor and create the card body and append in the gridviewbody
    if (cursor) {
      const flashCardsData = JSON.stringify(cursor.value);
      cardHtml(flashCardsData);
      cursor.continue();
    }
  };
  cursorRequest.onerror = (event) => {
    console.log("CursorRequest Open  Error");
  };
};
const cardHtml = (item) => {
    cardCount ++;
  //this needs to be created with dynamic objects.
  console.log(JSON.parse(item));
  item = JSON.parse(item);
  const newElement = document.createElement("div");
  newElement.className = "w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 px-4 mb-4";
  newElement.innerHTML = `
                <div class="bg-white shadow-md rounded-md p-4">
                    <h2 class="text-lg font-bold mb-2">Card ${
                      cardCount ?? 0
                    }</h2>
                    <p class="text-gray-600 mb-2">Question: ${
                      item?.question ?? ""
                    }</p>
                    <p class="text-gray-600 mb-2">Answer: ${item?.answer ?? ''}</p>
                    <p class="text-gray-600 mb-2">Difficulty Level: ${
                      item?.dificultLevel ?? ''
                    }</p>
                    <p class="text-gray-600 mb-2">Tags: ${item?.tag ?? ''}</p>
                    <p class="text-gray-600">Creation Date: ${item?.Created ?? ''}</p>
                </div>
    
        `;
  document.getElementById("gridViewBody").appendChild(newElement);
};

const createGridView = () => {
  const content = `<div class="container mx-auto">
        <h1 class="text-2xl font-bold mb-4">Flashcards</h1>
        <div class="flex flex-wrap -mx-4" id="gridViewBody">
         </div>
    </div>`;
  document.getElementById("mainContainer").innerHTML = content;
};

const displayEmptyFlashCards = () => {
  const content = `<div class="container mx-auto text-center">
    <h1 class="text-2xl font-bold mb-4">No Flashcards Found</h1>
    <p class="text-gray-600 mb-4">Oops! It looks like there are no flashcards available.</p>

    <div class="flex justify-center space-x-4">
        <button id="addFlashCard" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Add
            Flashcards</button>
        <button id="rejectAddFlashCard" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">No, Thanks</button>
    </div>
</div>`;
  document.getElementById("mainContainer").innerHTML = content;
  document.getElementById("addFlashCard").addEventListener("click", () => {
    displayFormHtml();
  });
};

const displayFormHtml = () => {
  const content = `<div class="container mx-auto w-1/2">
    <h1 class="text-2xl font-bold mb-4">Flashcard Form</h1>

    <form>
        <div class="mb-4">
            <label for="subject" class="block text-gray-700 font-bold mb-2">Subject</label>
            <input type="text" id="subject" name="subject"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div class="mb-4">
            <label for="question" class="block text-gray-700 font-bold mb-2">Question</label>
            <textarea id="question" name="question" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div class="mb-4">
            <label for="answer" class="block text-gray-700 font-bold mb-2">Answer</label>
            <textarea id="answer" name="answer" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div class="mb-4">
            <label for="difficultyLevel" class="block text-gray-700 font-bold mb-2">Difficulty Level</label>
            <select id="difficultyLevel" name="difficultyLevel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="tag" class="block text-gray-700 font-bold mb-2">Tag</label>
            <input type="text" id="tag" name="tag"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div class="mb-4">
            <label for="creationDate" class="block text-gray-700 font-bold mb-2">Creation Date</label>
            <input type="date" id="creationDate" name="creationDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <button type="submit"id="formSubmit"
            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Submit</button>
        <button type="submit" id="formCancel" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">Cancel</button>
            </form>
</div>`;
  document.getElementById("mainContainer").innerHTML = content;
  document.getElementById("formSubmit").addEventListener("click", (event) => {
    event.preventDefault();
    addNewFlashCard();
  });
};

const addNewFlashCard = () => {
  //store the values of all i/p -> add in IndexedDb -> make all i/p tags empty
  // const subject = document.getElementById("subject").value;
  // const question = document.getElementById("question");
  // const answer = document.getElementById("answer");
  // const dificultLevel = document.getElementById("difficultyLevel");
  // const tag = document.getElementById("tag");

  const newItem = {
    subject: document.getElementById("subject").value,
    question: document.getElementById("question").value,
    answer: document.getElementById("answer").value,
    dificultLevel: document.getElementById("difficultyLevel").value,
    tag: document.getElementById("tag").value,
    Created: document.getElementById("creationDate").value,
  };
  //start the DB transaction
  // Open a read/write DB transaction, ready for adding the data
  const transaction = db.transaction(["flashCards"], "readwrite");
  const objectStore = transaction.objectStore("flashCards");
  const request = objectStore.add(newItem);
  request.onsuccess = (e) => {
    console.log("Data Added Successfully");
    displayFlashCards();
  };
  request.onerror = (e) => {
    console.log("Some Error Occured");
  };
};
