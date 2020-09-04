import React from 'react';
import { qList } from './components/questions';
import './App.css';

class App extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         score: 0,
         options: [],
         isEnd: false,
         myAnswer: null,
         isDisabled: true,
         currentQuestion: 0,
         testtesttetssts: false
      }
   }

   componentDidMount() {
      this.loadQuizQuestions()
   }

   loadQuizQuestions = () => {
      this.setState(() => {
         return {
            question: qList[this.state.currentQuestion].question,
            options: qList[this.state.currentQuestion].options,
            answer: qList[this.state.currentQuestion].answer
         }
      })
   }

   handleNextQuestion = () => {
      const { myAnswer, answer, score } = this.state

      if (myAnswer === answer) {
         this.setState({
            score: score + 1
         })
      }

      this.setState({
         currentQuestion: this.state.currentQuestion + 1,
         myAnswer: null,
         isDisabled: true
      })
   }

   checkAnswer = (answer) => {
      this.setState({ 
         myAnswer: answer,
         isDisabled: false
      });
   };

   componentDidUpdate(prevProps, prevState) {
      if (this.state.currentQuestion !== prevState.currentQuestion) {
         this.setState(() => {
            return {
               question: qList[this.state.currentQuestion].question,
               options: qList[this.state.currentQuestion].options,
               answer: qList[this.state.currentQuestion].answer
            };
         });
      }
   }

   handleFinish = () => {
      if (this.state.currentQuestion === qList.length - 1) {
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
      const { question, options, currentQuestion, score, myAnswer, isDisabled, isEnd } = this.state

      if (isEnd) {
         return (
            <div className="app-wrapper">
               <div className="end-of-game">
                  <h3>End</h3>
                  <p>Your score is: {score} of {qList.length}</p>
               </div>
            </div>
         )
      }

      else {
         return (
            <div className="app-wrapper">
               <h6 className="question">Question {currentQuestion} of {qList.length}</h6>
               <h2 className="question">{question}</h2>
               
               {options.map((option, index) => 
                  <p key={index} className={`options ${myAnswer === option ? 'selected' : ''}`} onClick={() => this.checkAnswer(option)}>
                     {option}
                  </p>
               )}
   
               {currentQuestion < qList.length - 1 && (
                  <button disabled={isDisabled} onClick={this.handleNextQuestion}>Next</button>
               )}
   
               {currentQuestion === qList.length - 1 && (
                  <button onClick={this.handleFinish}>Finish</button>
               )}
            </div>
         )
      }
   }
}

export default App;
