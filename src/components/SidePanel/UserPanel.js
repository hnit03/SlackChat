import React, { Component } from "react";
import firebase from "../../firebase";
import AvatarEditor from 'react-avatar-editor';
import { Button, Dropdown, Grid, Header, Icon,Image,Input,Modal } from "semantic-ui-react";

class UserPanel extends Component{

    state = {
        user : this.props.currentUser,
        modal:false,
        previewImage: '',
        croppedImage:'',
        blob:''
    }

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

    handleCropImage = () =>{
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob =>{
                let imageURL = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageURL
                });
            })
        }
    }

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
                    </Grid.Row>

                    {/* User Dropdown */} 
                    <Header style={{padding: '0.25em'}} inverted as="h4">
                        <Dropdown trigger={
                            
                            <span> <Image src={user.photoURL} spaced="right" avatar />{this.state.user.displayName}</span>
                        } options={this.dropdownOption()}/>
                    </Header>

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
                                                ref= {node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={200}
                                                height={200}
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
                                                width={150}
                                                height={150}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && <Button color='green' inverted> 
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