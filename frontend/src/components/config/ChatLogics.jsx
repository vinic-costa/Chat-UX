// A função isSameSenderMargin recebe quatro argumentos: messages (uma matriz de objetos de mensagem), m (o objeto de mensagem atual),
//  i (o índice da mensagem atual na matriz) e userId (o ID do usuário atual)

export const isSameSenderMargin = (messages, m, i, userId) => {

    if (
        // mensagem existe
        i < messages.length - 1 &&
        // se a mensagem foi enviada pelo mesmo usuário
        messages[i + 1].sender._id === m.sender._id &&
        // não enviada pelo usuário atual
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            // mensagem enviada por usuário diferente
            messages[i + 1].sender._id !== m.sender._id &&
            // enviada pelo usuário atual
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

//  A função isSameSender também usa os mesmos quatro argumentos e é usada para determinar
//  se a mensagem atual e a próxima mensagem foram enviadas pelo mesmo usuário. 
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
        // mensagem não é do mesmo remetente
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