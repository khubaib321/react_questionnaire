import React from 'react';

export default class Dialog extends React.Component {
	selected = '';

	constructor(props) {
		super(props);
		this.state = {
			questionnaireList: []
		};
	}

	/**
	 * Called after first render
	 */
	componentDidMount() {
		fetch("http://localhost:8000/questionnaires/")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					questionnaireList: result
				});
			},
			(error) => {
				console.log('error', error);
			}
		);
	}

	/**
	 * Render helper function to display the list of qestionnaires
	 * fetched from server
	 * returns html ready for display 
	 */
	renderQuetionnaresList() {
		let questionnaireList = [];
		let questionnaireLength = this.state.questionnaireList.length;
		if (questionnaireLength) {
			for (let index = 0; index < questionnaireLength; ++index) {
				questionnaireList.push(
					<React.Fragment key={index}>
						<tr>
							<td>
								<label>{this.state.questionnaireList[index]}</label>
							</td>
							<td>
								<input
									type="radio"
									name="questionnaire-list"
									value={this.state.questionnaireList[index]}
									onClick={() => { this.selected = this.state.questionnaireList[index]; }}
								/>
							</td>
						</tr>
					</React.Fragment>
				);
			}
		}
		return questionnaireList;
	}

	/**
	 * Default render function to display
	 * the list of questionnaires
	 * returns final html ready for display
	 */
	render() {
		return (
			<div style={{width: '100%', textAlign: 'center'}}>
				<h1>Hello. Let's have a Dialog!</h1>
				<h3>Following Questionnaires are available at the moment:</h3>
				{
					this.state.questionnaireList.length > 0 ?
						<table style={{width: '10%', margin: '0 auto'}}>
							<tbody>
								{this.renderQuetionnaresList()}
							</tbody>
						</table>
					: 'Loading. Please wait...'
				}
				<h3>Please select one from the options above.</h3>
				<button onClick={() => this.letsStart()}>Let's Start!</button><br />
				<button onClick={() => this.props.history.goBack()}>Back</button>
			</div>
		);
	}

	/**
	 * Handles start button functionality
	 */
	letsStart() {
		if (!this.selected) {
			alert('Please make a selection.');
			return;
		}
		this.props.history.push('questionnaires/chat', { name: this.selected });
	}
}
