import React, { PropTypes, Component } from 'react'
import SpeechRecognition from 'react-speech-recognition'
import {
  Button,
  Form,
  InputGroup,
  Input,
  InputGroupAddon
} from "reactstrap";
import "../SpeechSearching/style.css";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";


class Speech extends Component {
  constructor(props) {
    super(props);
    this.changeListeningStatus = this.changeListeningStatus.bind(this);
  }
  state = {
    listening: false,
    keywords: null
  }

  changeListeningStatus = e => {

    this.setState({ listening: !this.state.listening });
    if (!this.state.listening == true)
      this.props.startListening()
    else {
      this.props.stopListening();
      this.setState({
        keywords: this.props.transcript
      });
    }

  }
  checkKeywords=e=>{
    this.props.resetTranscript();
    this.setState({
      keywords:null
    });
  }
  render() {

    const { transcript, resetTranscript, startListening, stopListening, browserSupportsSpeechRecognition } = this.props
    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    return (
      <span onClick={this.props.onClick} class="SpeechSearchBar">


        <InputGroup>
          <Button onClick={() => { this.changeListeningStatus() }} className="btn-gradient">{this.state.listening == true ? " Stop voice search" : " Start voice search"}</Button>
          <InputGroupAddon addonType="append">
            <Input type="text" name="keywords" value={transcript} />
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
          <Button className="btn-gradient" onClick={()=>{this.checkKeywords()}}> <FAIcon icon={this.state.keywords!=null?"trash":"search"} classes={["fa"]} /></Button>
    
          </InputGroupAddon>
        </InputGroup>
          </span>

    )
  }
}
const options = {
  autoStart: false
}
export default SpeechRecognition(options)(Speech);