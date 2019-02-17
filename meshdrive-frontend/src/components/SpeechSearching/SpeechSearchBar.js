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
import { connect } from 'react-redux';
import updateSearchKeywords from "../../actions/searching/updateSearchingKeywords";
import requireAuth from "../../hoc/requireAuth";


class SpeechSearchBar extends Component {
  constructor(props) {
    super(props);
    this.changeListeningStatus = this.changeListeningStatus.bind(this);
  }
  state = {
    listening: false,
    keywords: '',
    hideTextBar: false,
    hideSpeechBar: true
  }

  changeListeningStatus = e => {
    this.setState({
      listening: !this.state.listening,
      hideSpeechBar: !this.state.listening ? false : true,
      hideTextBar: !this.state.listening ? true : false,
      keywords: this.props.transcript
    });
    if (!this.state.listening == true) {
      this.props.resetTranscript();
      this.props.startListening();
    }
    else {
      this.props.stopListening();
      this.props.updateSearchKeywords(this.props.transcript);
    }

  }

  searchKeywords = e => {
    this.props.updateSearchKeywords(this.state.keywords);
  }

  handleOnchange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value.length === 0)
      this.props.updateSearchKeywords(e.target.value);

  }
  render() {
    const { transcript, browserSupportsSpeechRecognition } = this.props
    if (!browserSupportsSpeechRecognition) {
      return null;
    }

    return (
      <span onClick={this.props.onClick} class="SpeechSearchBar">
        <InputGroup>
          <InputGroupAddon addonType="append">

            <Button onClick={() => { this.changeListeningStatus() }}
              className={this.state.listening == false ? "btn-gradient" : ""}
              color={this.state.listening == true ? "danger" : ""} >
              <FAIcon icon="microphone" classes={["fa"]} /></Button>

          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <Button className={this.state.listening ? "disabled" : "btn-gradient"} onClick={() => { this.searchKeywords() }}>
              <FAIcon icnon="search" classes={["fa"]} /></Button>
          </InputGroupAddon>
          <InputGroupAddon addonType="append">
            <Input style={this.state.hideTextBar == false ? {} : { display: 'none', width: '120px' }}
              type="text" name="keywords" placeholder="Search..." value={this.state.keywords} onChange={this.handleOnchange} />

            <Input style={this.state.hideSpeechBar == false ? {} : { display: 'none' }}
              type="text" name="speehKeywords" value={transcript} />

          </InputGroupAddon>
        </InputGroup>
      </span>

    )
  }
}
const options = {
  autoStart: false
}

export default SpeechRecognition(options)(connect(null, { updateSearchKeywords })(requireAuth(SpeechSearchBar)));
