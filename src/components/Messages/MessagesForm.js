import React from "react";
import firebase from "../../firebase";
import { uuid } from 'uuidv4';
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState:'',
    message: "",
    percentUploaded: 0,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
    };
    if (fileURL!==null) {
      message['image'] = fileURL;
    }else{
      message['content'] = this.state.message;
    }
    return message;
  };

  uploadFile = ( file, metedata) =>{
     const pathToUpload = this.state.channel.id;
     const ref = this.props.messagesRef;
     const filePath = `chat/public/${uuid()}.jpg`;

     this.setState({
        uploadState: 'loading',
        uploadTask: this.state.storageRef.child(filePath).put(file,metedata)
     },
      () => {
        this.state.uploadTask.on('stage_changed', snap =>{
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          this.props.isProgressBarVisible(percentUploaded);
          this.setState({ percentUploaded });
        },
        err => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            uploadState: 'error',
            uploadTask: null
          });
        },
        () =>{
          this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL =>{
            this.sendFileMessage(downloadURL, ref, pathToUpload);
          })
          .catch( err =>{
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          })
        }
        )
      }
     );
  }

  sendFileMessage = (fileURL, ref, pathToUpload) =>{
    ref.child(pathToUpload)
    .push()
    .set(this.createMessage(fileURL))
    .then(()=>{
      this.setState({ uploadState: 'done' })
    })
    .catch(err =>{
      console.log(err);
      this.setState({ errors: this.state.errors.concat(err) })
    })
  }

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };



  render() {
    const { errors, message, loading,modal,uploadState,percentUploaded } = this.state;

    return (
      <Segment className="message_form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
            modal={modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
        />
        <ProgressBar 
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
