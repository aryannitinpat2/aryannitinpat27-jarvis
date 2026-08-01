package com.jarvis.assistant.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jarvis.assistant.ui.theme.*

@Composable
fun CallHandlingPanel(
    callerName: String,
    phoneNumber: String,
    onScreenCall: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(18.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Call, contentDescription = null, tint = Color(0xFF34A853))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Incoming Call Assistant", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34A853))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(callerName, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text(phoneNumber, fontSize = 13.sp, color = JarvisTextSecondary)
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onScreenCall,
                colors = ButtonDefaults.buttonColors(containerColor = JarvisCyan),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Screen Call with Jarvis AI", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}
