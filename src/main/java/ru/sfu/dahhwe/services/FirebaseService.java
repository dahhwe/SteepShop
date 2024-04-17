package ru.sfu.dahhwe.services;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Service
public class FirebaseService {

    private DatabaseReference database;

    @PostConstruct
    public void initialize() {
        try {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setDatabaseUrl("https://mystic-aileron-417516-default-rtdb.firebaseio.com/")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                database = FirebaseDatabase.getInstance().getReference();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void subscribeToTopic(String topic, String token) {
        List<String> tokens = Collections.singletonList(token);

        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance().subscribeToTopic(tokens, topic);
            System.out.println("Successfully subscribed to topic: " + response.getSuccessCount());
        } catch (FirebaseMessagingException e) {
            System.out.println("Failed to subscribe to topic: " + e.getMessage());
        }
    }

    public void sendMessageToAll(String sender, String message) {
        Message msg = Message.builder()
                .putData("sender", sender)
                .putData("message", message)
                .setNotification(Notification.builder().setTitle(sender).setBody(message).build())
                .setTopic("all")
                .build();

        String response;
        try {
            response = FirebaseMessaging.getInstance().send(msg);
            System.out.println("Successfully sent message: " + response);
        } catch (FirebaseMessagingException e) {
            System.out.println("Failed to send message: " + e.getMessage());
        }

        System.out.println("Sending message from " + sender + ": " + message);
    }

    public void writeNewMessage(String sender, String content, String room) {
        Map<String, Object> msg = new HashMap<>();
        msg.put("sender", sender);
        msg.put("content", content);

        System.out.println("Writing new message from " + sender + " to room " + room + ": " + content);

        database.child("messages").child(room).push().setValueAsync(msg);

        sendMessageToAll(sender, content);
    }
}