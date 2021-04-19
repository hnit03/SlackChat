import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel,setPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";

class DirectMessage extends React.Component {
  state = {
    activeChannel:'',
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref("user"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = currentUserUid => {
      console.log(this.state.presenceRef); 
    let loadedUsers = [];
    this.state.usersRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  changeChannel = user =>{
    const channelId = this.getChannelID(user.uid);
    const channelData = {
        id : channelId,
        name: user.name
    }
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  }

  setActiveChannel = userID =>{
    this.setState({
      activeChannel: userID
    })
  }

  getChannelID = userID =>{
      const currentUserUid = this.state.user.uid;
      console.log(userID < currentUserUid ? `${userID}/${currentUserUid}` : `/${currentUserUid}/${userID}`);
      return userID < currentUserUid ? `${userID}/${currentUserUid}` : `/${currentUserUid}/${userID}`;
  }

  isUserOnline = user => user.status === "online";

  render() {
    const { users,activeChannel } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            active={ user.uid === activeChannel }
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7 }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "gray"}
            />
            {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel,setPrivateChannel })(DirectMessage);
