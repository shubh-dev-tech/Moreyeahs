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

/** The name of the database for WordPress */
define( 'DB_NAME', 'moreyeahs-new' );

/** Database username */
define( 'DB_USER', 'moreyeahs_db_admin' );

/** Database password */
define( 'DB_PASSWORD', 'hlMj=tobUp3p' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

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
define('AUTH_KEY',         '1)Gy{cp_8~6bMK7Y,22o=eun+<$!^uEDzwgLdI|7&XG$JY49gvCf}K_Tmq`6OeWt');
define('SECURE_AUTH_KEY',  'OU_+2l]e%:VSUl*GN06/nS`:po#fc2<>>%.~4Z7(.K1_degEs&@T<0Xa^)O+p$LO');
define('LOGGED_IN_KEY',    '$1)m!%&A~#;Dh}eB6vCqMvmvf(p|:>ZD-gS(v$L*Jn.Jn;/YK4JpB~|~;+JI8?;t');
define('NONCE_KEY',        ';_{(6!A1]rp32[LC+Ifp 1%c<+/%1nQv_qgg6K7~nT<(#KOs*h1-O1JPFUoF%ke;');
define('AUTH_SALT',        'fY+xNJv?A6/ T?2F&->}#B+<54R/~NxK?MokPRqbdb-+_Yyh{d/tEX+kg--998-4');
define('SECURE_AUTH_SALT', ')o=N:MHo(I.Vbog6~*d:WE{[xqxM&Arhx#Y+SvAnKve}6aUqY74V4}rbj8H]5nax');
define('LOGGED_IN_SALT',   '.r4b[nDD@m:*`My/vj._o}~!t.K64gk!+|M|$9pesJk>Y<7x>HBU`H~2{vCcv=IS');
define('NONCE_SALT',       ' MVUCf+NBbj*L*4Pa^xv5B>,4b-DZ1((No =tM_.B)Hct2Cd!l8O^:aX:R<i/cpW');

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
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $_SERVER['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
}