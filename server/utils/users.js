const users = [];


//add user
export const addUser = ({name, userId, roomId, host, presenter}) => {
    const user = {name, userId, roomId, host, presenter}
    users.push(user);
    return users
}

//remove user
export const removeUser = (id) => {
    const index = users.findIndex(user => user.userId === id);
    if(index != -1){
        return users.splice(index, 1)[0]
    }
    return users
}

//get user from list
export const getUser = (id) =>{
    return users.find((user) => user.userId === id);
}

//get all users
export const getAllUsers = (roomId) =>{    
    return users.filter((user) => user.roomId === roomId)
}

