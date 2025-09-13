const createElement=(arr)=>{
    const htmlElements=arr.map(el => `<span class='btn'> ${el}</span>`)
    return(htmlElements .join(''))
}
// pronounciation 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner=(status)=>{
    if(status==true){
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    }
    else{
        document.getElementById('word-container').classList.remove('hidden')
        document.getElementById('spinner').classList.add('hidden')
    }
}

const loadLessons= ()=>{
    const url='https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
    .then(response => response.json())
    .then(json=> {
        displayLesson(json.data)
    })
}
const removeActiove =()=>{
    const lessonButtons=document.querySelectorAll('.lesson-btn')
    lessonButtons.forEach(btn=> btn.classList.remove('active'))
}

const loadLevelWord=(id)=>{
    manageSpinner(true);
    const url=`https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data=> {
        removeActiove();//remove all active class
        const clickBtn=document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add('active');//add active class
        displayLevelWord(data.data)
    })
}
const loadWordDetails=async(id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`
    const res=await fetch(url);
    const details =await res.json()
    displayWordDetails(details.data)
}

// 
// "word": "Eager",
// "meaning": "আগ্রহী",
// "pronunciation": "ইগার",
// "level": 1,
// "sentence": "The kids were eager to open their gifts.",
// "points": 1,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "enthusiastic",
// "excited",
// "keen"
// ],
// "id": 5

const displayWordDetails=(word)=>{
    console.log(word)
    const detailsBox=document.getElementById('details-container');
    detailsBox.innerHTML=`
        <div class="">
                <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>   :${word.pronunciation})</h2>
            </div>
            <div class="">
                <h2 class="font-bold">Meaning</h2>
                <p class="font-bangla">${word.meaning}</p>
            </div>
            <div class="">
                <h2 class="font-bold">Example</h2>
                <p>${word.sentence}</p>
            </div>
            <div class="">
                <h2>Synonyms</h2>
                <div class="">${createElement(word.synonyms)}</div>
            </div>
    `;
    document.getElementById('word_modal').showModal();
}

const displayLevelWord=(words)=>{
     // get the container and empty
    const wordContainer= document.getElementById('word-container');
    wordContainer.innerHTML='';

    if(words.length===0){
         wordContainer.innerHTML=`
        <div class="text-center col-span-full space-y-  ">
            <img src="./assets/alert-error.png" alt="" class="mx-auto">
            <p class="text-sm font-medium text-gray-500 mb-5 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-2xl font-bold font-bangla">নেক্সট Lesson এ যান।</h2>
        </div>
         `;
         manageSpinner(false);
        return;
    }
    
// "id": 6,
// "level": 5,
// "word": "Fascinate",
// "meaning": "মুগ্ধ করা",
// "pronunciation": "ফ্যাসিনেট"


    // get into every lesson
    words.forEach(word => {
        // create element
        const card=document.createElement('div')
        card.innerHTML=`
        <div class="bg-white rounded-xl text-center shadow-sm py-10 px-2 space-y-4">
            <h2 class="md:text-2xl font-bold">${word.word? word.word :'শব্দ পাওয়া যায়নি' }</h2>
            <p class="text-[14px] md:text-lg font-semibold">Meaning /Pronounciation</p>
            <div class="font-bangla font-medium md:text-xl">"${word.meaning? word.meaning: `অর্থ পাওয়া
                 যায়নি `} / ${word.pronunciation? word.pronunciation:`উচ্চারণ পাওয়া
                     যায়নি
                     `}"</div>
            <div class="flex justify-between items-center gap-3 px-8">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#badeff42] p-2"><i class="fa-solid fa-circle-info "></i></button>

               <button onclick="pronounceWord('${word.word}')" class="btn bg-[#badeff42] p-2 "> <i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        // append
        wordContainer.append(card);
        
    })
    manageSpinner(false);
}
const displayLesson=(lessons)=>{
    // get the container and empty
    const levelContainer= document.getElementById('level-container');
    levelContainer.innerHTML='';
    // get into every lesson
    lessons.forEach(lesson => {
        // create element
        const btnDiv=document.createElement('div')
        btnDiv.innerHTML=`
            <button id='lesson-btn-${lesson.level_no}' onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                <img src="assets/fa-book-open.png" alt="">
                Lesson-${lesson.level_no}
            </button>
        `
        // append
        levelContainer.append(btnDiv);
    })



}
loadLessons()

document.getElementById('btn-search').addEventListener('click',()=>{
    removeActiove();
    const input=document.getElementById('input-search');
    const searchValue=input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch(`https://openapi.programming-hero.com/api/words/all`)
    .then(res=>res.json())
    .then(data=> {
        const allWords=data.data;
        console.log(allWords);
        const filterwords=allWords.filter(word=>word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterwords)
    })
})