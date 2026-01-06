<?php
/**
 * Simple Test Block Template
 */

echo '<div style="padding: 20px; background: #f0f0f0; border: 2px solid #333; margin: 20px 0;">';
echo '<h3>🧪 Test Block Working!</h3>';
echo '<p>If you can see this, ACF blocks are working correctly.</p>';
echo '<p>Block ID: ' . ($block['id'] ?? 'No ID') . '</p>';
echo '<p>Current time: ' . current_time('mysql') . '</p>';
echo '</div>';
?>