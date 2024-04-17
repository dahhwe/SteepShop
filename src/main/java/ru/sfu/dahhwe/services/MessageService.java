package ru.sfu.dahhwe.services;

import org.springframework.stereotype.Service;

@Service
public class MessageService {

    private final FirebaseService firebaseService;

    public MessageService(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    public void addMessage(String sender, String message, String room) {
        firebaseService.writeNewMessage(sender, message, room);
    }
}