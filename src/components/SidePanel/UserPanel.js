import React, { Component } from "react";
import firebase from "../../firebase";
import AvatarEditor from 'react-avatar-editor';
import { Button, Dropdown, Grid, Header, Icon,Image,Input,Modal } from "semantic-ui-react";

class UserPanel extends Component{

    state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: "",
    croppedImage: "",
    blob: null,
    uploadedCroppedImage: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref("users"),
    metadata: {
      contentType: "image/jpeg"
    }
  };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    dropdownOption = () =>[
        {
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span onClick={this.openModal} >Change avatar</span>
        },
        {
            key:'signout',
            text: <span onClick={this.handleSignout}>
            <Icon name="sign-out"/>
            Sign out
            </span>
        }
    ]

    handleSignout = () =>{
        firebase
        .auth()
        .signOut();
    };

    handleChange = event =>{
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load',()=>{
                this.setState({ previewImage: reader.result });
            });
        }
    }

    handleCropImage = () => {
        if (this.avatarEditor) {
          this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
            let imageUrl = URL.createObjectURL(blob);
            this.setState({
              croppedImage: imageUrl,
              blob
            });
          });
        }
      };

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;
    
        console.log(storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata));

        storageRef
          .child(`avatars/user-${userRef.uid}`)
          .put((blob, metadata))
          .then(snap => {
            snap.ref.getDownloadURL().then(downloadURL => {
              this.setState({ uploadedCroppedImage: downloadURL }, () =>
                this.changeAvatar()
              );
            });
          });
      }

      changeAvatar = () => {
        this.state.userRef
          .updateProfile({
            photoURL: this.state.uploadedCroppedImage
          })
          .then(() => {
            console.log("PhotoURL updated");
            this.closeModal();
          })
          .catch(err => {
            console.error(err);
          });
    
        this.state.usersRef
          .child(this.state.user.uid)
          .update({ avatar: this.state.uploadedCroppedImage })
          .then(() => {
            console.log("User avatar updated");
          })
          .catch(err => {
            console.error(err);
          });
      };

    render(){

        const { user,modal,previewImage,croppedImage } = this.state;
        return(
            <Grid style={{background:'#3498db'}}>
                <Grid.Column>
                    <Grid.Row style={{padding:'1.2rem', margin: 0}}>
                    {/* App Header */} 
                        <Header inverted floated="left" as="h2">
                        <Icon name="wechat"/>
                            <Header.Content>SlackChat</Header.Content>
                        </Header>

                        {/* User Dropdown */} 
                        <Header style={{padding: '0.25em'}} inverted as="h4">
                            <Dropdown trigger={
                                
                                <span> <Image src={user.photoURL} spaced="right" avatar />{this.state.user.displayName}</span>
                            } options={this.dropdownOption()}/>
                        </Header>
                    </Grid.Row>

                    

                    <Modal basic open={modal} onClose={this.closeModal} >
                        <Modal.Header>Change User avatar</Modal.Header>
                        <Modal.Content>
                            <Input 
                                fluid
                                type='file'
                                label='New Avatar'
                                name='previewImage'
                                onChange={this.handleChange}
                            />
                            <Grid centered stackable columns={2} >
                                <Grid.Row centered >
                                    <Grid.Column className='ui center aligned grid'>
                                        {previewImage && (
                                            <AvatarEditor 
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage &&(
                                            <Image 
                                                src={croppedImage}
                                                style={{ margin:'3.5em auto' }}
                                                width={100}
                                                height={100}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button color='green' inverted onClick={this.uploadCroppedImage}> 
                                <Icon name='save'/> Change Avatar
                            </Button>}
                            <Button color='green' inverted onClick={this.handleCropImage}> 
                                <Icon name='image'/> Preview
                            </Button>
                            <Button color='red' inverted onClick={this.closeModal}> 
                                <Icon name='remove'/> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;