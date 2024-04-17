package ru.sfu.dahhwe.controllers;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sfu.dahhwe.services.FirebaseService;
import ru.sfu.dahhwe.services.MessageService;

import java.util.Map;

@RestController
public class MessageController {

    private final MessageService messageService;
    private final FirebaseService firebaseService;

    public MessageController(MessageService messageService, FirebaseService firebaseService) {
        this.messageService = messageService;
        this.firebaseService = firebaseService;
    }

    public static class Message {
        public String sender;
        public String message;
        public String room;
    }

    @PostMapping("/messages")
    public void addMessage(@RequestBody Message msg) {
        messageService.addMessage(msg.sender, msg.message, msg.room);
    }


    @PostMapping("/api/saveToken")
    public void saveToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String userId = payload.get("username");

        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }

        DatabaseReference tokensRef = FirebaseDatabase.getInstance().getReference("tokens");

        tokensRef.child(userId).setValueAsync(token);

        firebaseService.subscribeToTopic("all", token);
    }

}