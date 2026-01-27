<?php


/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// Include dynamic environment configuration
require_once __DIR__ . '/wp-config-dynamic.php';

// ** Database settings - These are now handled by wp-config-dynamic.php ** //
// The dynamic config will set these based on environment detection
// You can override them here if needed for specific environments

// Fallback database settings (only used if not set by dynamic config)
if (!defined('DB_NAME')) define( 'DB_NAME', 'moreyeahs-new' );
if (!defined('DB_USER')) define( 'DB_USER', 'root' );
if (!defined('DB_PASSWORD')) define( 'DB_PASSWORD', '' );
if (!defined('DB_HOST')) define( 'DB_HOST', 'localhost' );
if (!defined('DB_CHARSET')) define( 'DB_CHARSET', 'utf8mb4' );
if (!defined('DB_COLLATE')) define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'A-,Ly7Hq09ad/:=zNR8s-4Hr$(fI1a7H[Y  z[EdZ83udV}vhC&u&SERuT+ev`qB' );
define( 'SECURE_AUTH_KEY',  'fm@+[M9)X5FQE&s_>p#dbDz3n6P3fNINUUY:~xHja*+i$NrAC`kFV~4BCaQ!]IHy' );
define( 'LOGGED_IN_KEY',    's$<d tqKXI]>m~Df zM=B`NmRBgnJtYJa~Zo8*=wotU7.9c#3V<~Mq &n*CqXka(' );
define( 'NONCE_KEY',        'yg?YH!pVVMS+~mTFiNoUvD9X/_N)vq M@2@P=K<}HNyJT$0&vkl.6*9/nSvm[xQR' );
define( 'AUTH_SALT',        'Avk0+w)@USN;Ft`3&O|TV{Y/F)bum!HyyxLM8pxv8t3|-X62K7 I>$c(Hcjol%:{' );
define( 'SECURE_AUTH_SALT', 'tAH{h [_B?qXPD:miNaI&,j3:^RwF?MJJj4>Pa&3.7Y|9#aT+P#pctCo.1dJ$&3n' );
define( 'LOGGED_IN_SALT',   'FVb}B]*q1?^4EP.TJ?K- &kbE=Qw,3/9ObxgHICF96k6j j$cbZR^D^{HY,=+q-k' );
define( 'NONCE_SALT',       '^n`y)Nt[k,(sbaDRO!~P$/Udngh-uyVB+9UD6F(!T0VNb~uuv&(IC?5.9h&<p7&k' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
// define( 'WP_DEBUG', false ); // Now handled by wp-config-dynamic.php

/* Add any custom values between this line and the "stop editing" line. */

// JWT Authentication Configuration - Now handled by dynamic config
// The dynamic config will set these based on environment
// You can override them here if needed



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

