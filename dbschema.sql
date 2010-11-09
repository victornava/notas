# Sequel Pro dump
# Version 663
# http://code.google.com/p/sequel-pro
#
# Host: localhost (MySQL 5.0.41)
# Database: bm000354_notas
# Generation Time: 2010-07-08 23:33:41 +1000
# ************************************************************

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table fonts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fonts`;

CREATE TABLE `fonts` (
  `id` int(11) NOT NULL default '0',
  `name` varchar(30) default NULL,
  `value` varchar(140) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table imgs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `imgs`;

CREATE TABLE `imgs` (
  `id` int(11) NOT NULL default '0',
  `url` varchar(200) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table notes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notes`;

CREATE TABLE `notes` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `user_id` int(11) unsigned NOT NULL,
  `color` varchar(30) default NULL,
  `font_type` varchar(20) default NULL,
  `font_size` varchar(15) default NULL,
  `font_color` varchar(15) default NULL,
  `pos_x` varchar(15) default NULL,
  `pos_y` varchar(15) default NULL,
  `pos_z` varchar(15) default NULL,
  `width` varchar(15) default NULL,
  `height` varchar(15) default NULL,
  `is_private` int(15) default '1',
  `content` varchar(2000) default NULL,
  `date_created` datetime default NULL,
  `date_deleted` datetime default NULL,
  `state` varchar(10) NOT NULL default '''active''',
  `last_modified` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=723 DEFAULT CHARSET=utf8;



# Dump of table user_prefs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_prefs`;

CREATE TABLE `user_prefs` (
  `user_id` int(11) unsigned NOT NULL default '1',
  `font_type` varchar(20) default NULL,
  `font_size` varchar(20) default NULL,
  `font_color` varchar(30) default NULL,
  `bg_color` varchar(30) default NULL,
  `bg_img` varchar(100) default NULL,
  `color` varchar(30) default NULL,
  `width` varchar(20) default NULL,
  `height` varchar(20) default NULL,
  PRIMARY KEY  (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(60) default NULL,
  `email` varchar(60) default NULL,
  `password` varchar(40) default NULL,
  `screen_name` varchar(40) default NULL,
  `date_added` datetime default NULL,
  `last_modified` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `last_login` datetime default NULL,
  `login_count` int(11) unsigned default NULL,
  PRIMARY KEY  (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
