import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         score: 0,
         options: [],
         isEnd: false,
         questions: [],
         myAnswer: null,
         isLoading: true,
         currentQuestion: 0,
         isBtnDisabled: true
      }

      this.handleFinish = this.handleFinish.bind(this)
      this.loadQuizQuestions = this.loadQuizQuestions.bind(this)
      this.handleNextQuestion = this.handleNextQuestion.bind(this)
   }

   async loadQuizQuestions() {
      const res = await axios.get(`https://opentdb.com/api.php?amount=10&type=multiple`);
      const { data } = res;
      this.setState({
         questions: data.results,
         isLoading: false
      })

      const { questions, currentQuestion } = this.state
      this.setState(() => {
         return {
            question: questions[currentQuestion].question,
            options: [...questions[currentQuestion].incorrect_answers, questions[currentQuestion].correct_answer].sort(() => Math.random() - .5),
            answer: questions[currentQuestion].correct_answer
         }
      })
   }

   componentDidMount() {
      this.loadQuizQuestions()
   }

   checkAnswer(answer) {
      this.setState({ 
         myAnswer: answer,
         isBtnDisabled: false
      });
   };

   handleNextQuestion() {
      const { myAnswer, answer, score } = this.state

      if (myAnswer === answer) {
         this.setState({
            score: score + 1
         })
      }

      this.setState({
         currentQuestion: this.state.currentQuestion + 1,
         myAnswer: null,
         isBtnDisabled: true
      })
   }

   componentDidUpdate(prevProps, prevState) {
      const { questions, currentQuestion } = this.state
      if (currentQuestion !== prevState.currentQuestion) {
         this.setState(() => {
            return {
               question: questions[currentQuestion].question,
               options: [...questions[currentQuestion].incorrect_answers, questions[currentQuestion].correct_answer].sort(() => Math.random() - .5),
               answer: questions[currentQuestion].correct_answer
            };
         });
      }
   }

   handleFinish() {
      if (this.state.currentQuestion === this.state.questions.length - 1) {
         this.setState({
            isEnd: true
         });
      }
      if (this.state.myAnswer === this.state.answer) {
         this.setState({
           score: this.state.score + 1
         });
      }
   }

   render() {
      const { isLoading, questions, question, options, currentQuestion, score, myAnswer, isBtnDisabled, isEnd } = this.state

      function decodeString(str) {
         const textArea = document.createElement('textarea')
         textArea.innerHTML= str
         return textArea.value
      }
      
      if (isLoading) {
         return (
            <div className="app-wrapper">
               <div className="end-of-game">
                  <h3>Loading...</h3>
               </div>
            </div>
         )
      } else if (isEnd) {
         return (
            <div className="app-wrapper">
               <div className="end-of-game">
                  <h3>You have reached the end of the quiz</h3>
                  {score >= 2 && score <= 4 ? 'Focus more next time 😉' 
                     : score >= 5 && score <= 7 ? 'You have a pretty decent score 😁'
                     : score >= 8 ? 'Wow! I am amazed of your score 🤩'
                     : ''
                  }
                  <p>Your score is: {score} of {questions.length}</p>
               </div>
            </div>
         )
      } else {
         return (
            <div className="app-wrapper">
               <h6 className="question">Question {currentQuestion + 1} of {questions.length}</h6>
               <h2 className="question">{decodeString(question)}</h2>
               
               {options.map((option, index) => 
                  <p key={index} className={`options ${myAnswer === option ? 'selected' : ''}`} onClick={() => this.checkAnswer(option)}>
                     {decodeString(option)}
                  </p>
               )}
   
               {currentQuestion < questions.length - 1 && (
                  <button disabled={isBtnDisabled} onClick={this.handleNextQuestion}>Next</button>
               )}
   
               {currentQuestion === questions.length - 1 && (
                  <button onClick={this.handleFinish}>Finish</button>
               )}
            </div>
         )
      }
   }
}

export default App;
