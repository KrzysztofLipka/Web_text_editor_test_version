import React from 'react';
import ReactDOM from "react-dom";
import {Editor, EditorState,RichUtils, convertToRaw} from 'draft-js';
var axios = require('axios');
var qs = require('qs');


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

  }

  _wordClick(props){

	 const {editorState} = this.state;

	 const contentState = convertToRaw( editorState.getCurrentContent());
	 const x = editorState.getCurrentContent();
      var synrequest = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

	/*to odpowiada za pobieranie zaznaczenia*/
      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);


	 axios.get('/background_process?proglang='+selectedText,{})
         .then(function(response){

		  console.log(response.data);
	/*console log odpowiada za wyswietlanie co jest pbierane z serwera(na stronie sie nie wyswietla)*/
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);

		/*response.data.result to pobrana lista synonimow*/
	var synonyms = response.data.result


	var synolist = synonyms.map(function(person){

	return <li><a href = '#'>{person}</a></li>;
});
ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('synonim_menu'))



    }).catch(function(error){
		/*!!!!!!!!! tu macie robienie listy synonimow bez serwera(gdy jest błąd 404 bo nie ma serwera)*/
      console.log(error);

	var tymczasowa_lista = ['word1' , 'word2', 'word3','word4','word5','word6', 'word7','word1' , 'word2', 'word3','word4','word5','word6', 'word7']
	/*map robi liste slow */
	var synolist = tymczasowa_lista.map(function(person){
	return <li><a href = '#'>{person}</a></li>;
	 });
	  ReactDOM.render(<ul>{synolist}</ul>,document.getElementById('synonim_menu'))
    });

  }

  render() {
      const {editorState} = this.state;
      var synrequest =  JSON.stringify(convertToRaw(editorState.getCurrentContent()))
	  const x = editorState.getSelection();

      var usersWithName = synrequest
	  /*y odpowiada za pobieranie samego tekstu z edytora*/
      const y = editorState.getCurrentContent().getPlainText()

	/*to odpowiada za pobieranie zaznaczenia*/
      var selectionState = editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = editorState.getCurrentContent();
      var currentContentBlock = currentContent.getBlockForKey(anchorKey);
      var start = selectionState.getStartOffset();
      var end = selectionState.getEndOffset();
      var selectedText = currentContentBlock.getText().slice(start, end);

    return (

    <div id='APPX'>
		<div id  = 'TOP'>
		<button onClick={this._wordClick.bind(this)}>Synonims</button>
		</div>

    <div className='editor'>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
			placeholder = 'tutaj wpisz tekst....'/>
      </div>

  <div id  = 'WYNIK'>
		<div id  = 'synonim_menu'>synonimy</div>
		<div id = 'statystyki_tekstu'>statystyki tekstu</div>
		<div id = 'definicja'>definicja</div>
		<div id = 'ontologie'>ontologie</div>
  </div>
</div>
    );
  }
}
