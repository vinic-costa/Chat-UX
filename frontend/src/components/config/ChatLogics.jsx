// The isSameSenderMargin function takes four arguments: messages (an array of message objects), m (the current message object),
//  i (the index of the current message in the array), and userId (the ID of the current user)

export const isSameSenderMargin = (messages, m, i, userId) => {

    if (
        // message exists
        i < messages.length - 1 &&
        // if sent by same user
        messages[i + 1].sender._id === m.sender._id &&
        // not sent by current user
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            // sent by different user
            messages[i + 1].sender._id !== m.sender._id &&
            // sent by current user
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

// The isSameSender function also takes the same four arguments and is used to determine
//  if the current message and the next message were sent by the same user. 
export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        // message not from same sender
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};