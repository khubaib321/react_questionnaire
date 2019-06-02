import React from 'react';

export default class QuestionAnswer extends React.Component {
	answer = "";
	answerPlaceholder = "type here...";

	/**
	 * Renders the Question Answer combo
	 * If no question then do not display anything
	 * If disabled then don't display answer input box, only the given answer
	 */
	render() {
		if (!this.props.question) {
			return null;
		}
		return (
			<div style={{width: '100%', margin: '0 auto', textAlign: 'center'}}>
				<h3>{this.props.question}</h3>
				{
					this.props.disable ?
						<p>{this.props.answer}</p>
					:
					this.props.subject ? 
						<React.Fragment>
							<input
								type="text"
								className="answer"
								readOnly={this.props.disable}
								placeholder={this.answerPlaceholder}
								onBlur={(e) => this.handleChange(e)}
							/>
							<button onClick={(e) => this.prepareForSubmit(e)}>Submit</button>
						</React.Fragment>
					:
					''
				}
			</div>
		);
	}

	/**
	 * Call handleSubmit of Questionnaire class
	 * Bound in the renderQAs function of Questionnaire class
	 */
	prepareForSubmit(event) {
		this.props.onClick(
			this.props.subject,
			this.props.question,
			this.answer
		);
	}

	/**
	 * When focus is lost on the answer input box, whatever
	 * is in that input is saved to send to parent in prepareForSubmit()
	 */
	handleChange(event) {
		this.answer = event.currentTarget.value;
	}
}
