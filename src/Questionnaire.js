import React from 'react';
import QuestionAnswer from './QuestionAnswer.js';

export default class Questionnaire extends React.Component {
    answerGiven = '';
    questionString = '';
    questionSubject = '';

    constructor(props) {
        super(props);
        this.state = {
            cid: '0',
            name: props.location.state.name,
            questionAnswers: []
        };
    }

    /**
     * Called after first render
     */
    componentDidMount() {
        this.submitAndFetch();
    }

    /**
     * Sends current state to server
     * and updates the state when the response is returned
     */
    submitAndFetch() {
        fetch("http://localhost:8000/questionnaires/chat/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'cid': this.state.cid,
                'answer': this.answerGiven,
                'question': this.questionSubject,
                'questionnaire': this.state.name
            })
        })
        .then(req => req.json())
        .then(
            (result) => {
                // On successful call, the state is updated with next question
                // returned from the server
                let newState = {
                    cid: result.cid,
                    name: result.name,
                    questionAnswers: this.state.questionAnswers
                };
                let qaLength = newState.questionAnswers.length;
                if (qaLength > 0) {
                    newState.questionAnswers[qaLength - 1].userAnswer = this.answerGiven;
                }
                let response = result.response;
                if (typeof(response) === 'object') {
                    for (let v in response) {
                        newState.questionAnswers.push({
                            userAnswer: '',
                            questionSubject: v,
                            questionString: response[v]
                        });
                    }
                } else if (typeof(response) === 'string') {
                    newState.questionAnswers.push({
                        userAnswer: '',
                        questionSubject: '',
                        questionString: response
                    });
                } else {
                    console.log('Invalid Question', result.response);
                }
                // setting state will trigger render again
                this.setState(newState);
            },
            (error) => {
                console.log('error', error);
            }
        );
    }

    /**
     * Render helper to display the question answer combo
     * returns html for display
     */
    renderQAs() {
        let qaRender = [];
        let qaLength = this.state.questionAnswers.length;
        if (qaLength && qaLength > 0) {
            /** 
             * Only the most recent question should be answerable.
             * This is handeled by sending a boolean value in disable property
             * to the QuestonAnswer component, which handles how to display it
             */
            for (let index = 0; index < this.state.questionAnswers.length - 1; ++index) {
                qaRender.push(
                    <QuestionAnswer
                        key={index}
                        disable={true}
                        answer={this.state.questionAnswers[index].userAnswer}
                        subject={this.state.questionAnswers[index].questionSubject}
                        question={this.state.questionAnswers[index].questionString} 
                        onClick={(s, q, a) => this.handleSubmit(s, q, a)}
                    />
                );
            }
            /** 
             * Most recent question is answerable.
             * Boolean value disable is set to false
             */
            qaRender.push(
                <QuestionAnswer
                    key={qaLength - 1}
                    disable={false}
                    answer={this.state.questionAnswers[qaLength - 1].userAnswer}
                    subject={this.state.questionAnswers[qaLength - 1].questionSubject}
                    question={this.state.questionAnswers[qaLength - 1].questionString}
                    onClick={(s, q, a) => this.handleSubmit(s, q, a)}
                />
            );
        }
        return qaRender;
    }

    /**
     * Default render function to display
     * the list of question answers
     * returns final html ready for display
     */
    render() {
        return (
            <div style={{width: '100%', margin: '0 auto', textAlign: 'center'}}>
                {this.renderQAs()}
                <button onClick={() => this.props.history.goBack()}>Back</button>
            </div>
        );
    }

    /**
     * Handles submit functionality for each question
     * Verfies the answer first then calls submitAndFetch()
     */
    handleSubmit(questionSubject, questionString, answerGiven) {
        this.answerGiven = answerGiven;
        this.questionString = questionString;
        this.questionSubject = questionSubject;
        if (this.verifyAnswer()) {
            this.submitAndFetch();
            return;
        }
        alert('Please write the exact answer from options provided. You can Copy and Paste.');
    }

    /**
     * Verifies whether given answer is in the
     * options provided or not
     */
    verifyAnswer() {
        if (!this.answerGiven ||
            !this.questionString ||
            !this.questionSubject
        ) {
            return false;
        }
        let optionsString = this.questionString.split('(').pop().split(')')[0];
        let optionsArray = optionsString.split('/');
        if (optionsArray.indexOf(this.answerGiven) === -1) {
            return false;
        }
        return true;
    }
}
