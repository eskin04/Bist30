-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 08 Oca 2024, 12:59:47
-- Sunucu sürümü: 5.7.36
-- PHP Sürümü: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `borsa`
--

DELIMITER $$
--
-- Yordamlar
--
DROP PROCEDURE IF EXISTS `en_fazla_kar_eden_sirket`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `en_fazla_kar_eden_sirket` ()  SELECT hisseler.hisse_ad,kar.kar_degisim,kar.kar_son_ceyrek
FROM hisseler,kar
WHERE hisseler.hisse_id=kar.hisse_id
AND kar.kar_degisim=(SELECT MAX(kar.kar_degisim)FROM kar)$$

DROP PROCEDURE IF EXISTS `en_fazla_zarar_eden_sirket`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `en_fazla_zarar_eden_sirket` ()  SELECT hisseler.hisse_ad,kar.kar_degisim,kar.kar_son_ceyrek
FROM hisseler,kar
WHERE hisseler.hisse_id=kar.hisse_id
AND kar.kar_degisim=(SELECT MIN(kar.kar_degisim)FROM kar)$$

DROP PROCEDURE IF EXISTS `get_hisse`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_hisse` (IN `hisse_sembol` VARCHAR(10))  SELECT hisseler.hisse_id,hisseler.hisse_fiyat
FROM hisseler
WHERE hisseler.hisse_sembol = hisse_sembol$$

DROP PROCEDURE IF EXISTS `hisse_analiz`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `hisse_analiz` ()  SELECT hisseler.hisse_id,hisseler.hisse_ad,hisseler.hisse_sembol,satislar.satislar_son_ceyrek,satislar.satislar_ilk_ceyrek,satislar.satislar_degisim,favok.favok_son_ceyrek,favok.favok_ilk_ceyrek,favok.favok_degisim,kar.kar_son_ceyrek,kar.kar_ilk_ceyrek,kar.kar_degisim,ozkaynaklar.ozkaynaklar_son_ceyrek,ozkaynaklar.ozkaynaklar_ilk_ceyrek,ozkaynaklar.ozkaynaklar_degisim,net_borc.net_borc_son_ceyrek,net_borc.net_borc_ilk_ceyrek,net_borc.net_borc_degisim
FROM hisseler,satislar,favok,kar,ozkaynaklar,net_borc
WHERE hisseler.hisse_id=satislar.hisse_id
AND hisseler.hisse_id=favok.hisse_id
AND hisseler.hisse_id=kar.hisse_id
AND hisseler.hisse_id=ozkaynaklar.hisse_id
AND hisseler.hisse_id=net_borc.hisse_id$$

DROP PROCEDURE IF EXISTS `portfoy`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `portfoy` (IN `id` INT)  SELECT hisseler.hisse_id,hisseler.hisse_ad,hisseler.hisse_fiyat,portfoy_hisse.hisse_adet,portfoy.bakiye,portfoy.kullanici_id,hisseler.hisse_sembol
FROM hisseler,portfoy,portfoy_hisse
WHERE hisseler.hisse_id=portfoy_hisse.hisse_id
AND portfoy_hisse.portfoy_id=portfoy.portfoy_id
AND portfoy.kullanici_id=id$$

DROP PROCEDURE IF EXISTS `portfoy_insert`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `portfoy_insert` (IN `hisse_id` INT, IN `portfoy_id` INT, IN `adet` INT)  INSERT INTO portfoy_hisse (portfoy_hisse.hisse_id,portfoy_hisse.portfoy_id,portfoy_hisse.hisse_adet)
VALUES (hisse_id,portfoy_id,adet)$$

DROP PROCEDURE IF EXISTS `portfoy_update`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `portfoy_update` (IN `kullanici_id` INT, IN `bakiye` INT)  UPDATE portfoy
SET portfoy.bakiye = bakiye
WHERE portfoy.kullanici_id = kullanici_id$$

DROP PROCEDURE IF EXISTS `temel_analiz_verileri`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `temel_analiz_verileri` (IN `sembol` VARCHAR(10))  SELECT hisseler.hisse_id,hisseler.hisse_ad,hisseler.hisse_sembol,satislar.satislar_son_ceyrek,satislar.satislar_ilk_ceyrek,satislar.satislar_degisim,favok.favok_son_ceyrek,favok.favok_ilk_ceyrek,favok.favok_degisim,kar.kar_son_ceyrek,kar.kar_ilk_ceyrek,kar.kar_degisim,ozkaynaklar.ozkaynaklar_son_ceyrek,ozkaynaklar.ozkaynaklar_ilk_ceyrek,ozkaynaklar.ozkaynaklar_degisim,net_borc.net_borc_son_ceyrek,net_borc.net_borc_ilk_ceyrek,net_borc.net_borc_degisim
FROM hisseler,satislar,favok,kar,ozkaynaklar,net_borc
WHERE hisseler.hisse_id=satislar.hisse_id
AND hisseler.hisse_id=favok.hisse_id
AND hisseler.hisse_id=kar.hisse_id
AND hisseler.hisse_id=ozkaynaklar.hisse_id
AND hisseler.hisse_id=net_borc.hisse_id
AND hisseler.hisse_sembol=sembol$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `favok`
--

DROP TABLE IF EXISTS `favok`;
CREATE TABLE IF NOT EXISTS `favok` (
  `favok_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_id` int(11) NOT NULL,
  `favok_son_ceyrek_tarih` date NOT NULL,
  `favok_son_ceyrek` int(11) NOT NULL,
  `favok_ilk_ceyrek_tarih` date NOT NULL,
  `favok_ilk_ceyrek` int(11) NOT NULL,
  `favok_degisim` int(11) NOT NULL,
  PRIMARY KEY (`favok_id`),
  KEY `hisse_id` (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `favok`
--

INSERT INTO `favok` (`favok_id`, `hisse_id`, `favok_son_ceyrek_tarih`, `favok_son_ceyrek`, `favok_ilk_ceyrek_tarih`, `favok_ilk_ceyrek`, `favok_degisim`) VALUES
(13, 1, '2023-09-01', 93325000, '2022-09-01', 58057000, 61),
(14, 3, '2023-09-01', 10441140, '2022-09-01', 25980120, -60),
(15, 4, '2023-09-01', 69579655, '2022-09-01', 51348055, 36),
(16, 5, '2023-09-01', 374803, '2022-09-01', 781414, -52),
(17, 6, '2023-09-01', 15093490, '2022-09-01', 8257208, 83),
(18, 7, '2023-09-01', 7152751, '2022-09-01', 4106832, 74),
(19, 8, '2023-09-01', 2930532, '2022-09-01', 1157225, 153),
(20, 9, '2023-09-01', 14102205, '2022-09-01', 7917767, 78),
(21, 10, '2023-09-01', 2470837, '2022-09-01', 2436084, 1),
(22, 11, '2023-09-01', 10526045, '2022-09-01', 10324484, 2),
(23, 12, '2023-09-01', 26416280, '2022-09-01', 11972963, 121),
(24, 13, '2023-09-01', 71773052, '2022-09-01', 50046678, 43),
(25, 14, '2023-09-01', 610135, '2022-09-01', 3135750, -81),
(26, 15, '2023-09-01', 671757, '2022-09-01', 1431280, -53),
(27, 16, '2023-09-01', 68705073, '2022-09-01', 42991547, 60),
(28, 17, '2023-09-01', 163636000, '2022-09-01', 112060154, 46),
(29, 18, '2023-09-01', -41904, '2022-09-01', 243935, -1),
(30, 19, '2023-09-01', 1589033, '2022-09-01', 2568795, -38),
(31, 19, '2023-09-01', 1589033, '2022-09-01', 2568795, -38),
(32, 21, '2023-09-01', 1232793, '2022-09-01', 2694602, -54),
(33, 22, '2023-09-01', 5381811, '2022-09-01', 2095166, 157),
(34, 23, '2023-09-01', 1009121, '2022-09-01', 3538692, -71),
(35, 24, '2023-09-01', 18007974, '2022-09-01', 10133933, 78),
(36, 25, '2023-09-01', 74813814, '2022-09-01', 55420820, 35),
(37, 26, '2023-09-01', 4603920, '2022-09-01', 5264571, -13),
(38, 27, '2023-09-01', 18358922, '2022-09-01', 15824367, 16),
(39, 28, '2023-09-01', 28153924, '2022-09-01', 15416437, 83),
(40, 29, '2023-09-01', 12002701, '2022-09-01', 6992085, 72),
(41, 30, '2023-09-01', 56519567, '2022-09-01', 38840488, 46),
(42, 31, '2023-09-01', 63643554, '2022-09-01', 45832047, 39);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `hisseler`
--

DROP TABLE IF EXISTS `hisseler`;
CREATE TABLE IF NOT EXISTS `hisseler` (
  `hisse_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_ad` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `hisse_fiyat` float(20,2) NOT NULL,
  `hisse_sembol` varchar(10) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `hisseler`
--

INSERT INTO `hisseler` (`hisse_id`, `hisse_ad`, `hisse_fiyat`, `hisse_sembol`) VALUES
(1, 'Türk Hava Yolları A.O.', 228.00, 'THYAO'),
(3, 'Ereğli Demir ve Çelik Fabrikaları T.A.Ş. ', 40.36, 'EREGL'),
(4, 'Akbank T.A.Ş.', 37.58, 'AKBNK'),
(5, 'Alarko Holding A.Ş.', 85.55, 'ALARK'),
(6, 'Arçelik A.Ş. ', 123.90, 'ARCLK'),
(7, 'Aselsan Elektronik Sanayi ve Ticaret A.Ş. ', 43.56, 'ASELS'),
(8, 'Astor Enerji A.Ş.', 86.10, 'ASTOR'),
(9, 'Bim Birleşik Mağazalar A.Ş.', 303.25, 'BIMAS'),
(10, 'Emlak Konut Gayrimenkul Yatırım Ortaklığı A.Ş.', 6.82, 'EKGYO'),
(11, 'Enka İnşaat ve Sanayi A.Ş.', 34.00, 'ENKAI'),
(12, 'Ford Otomotiv Sanayi A.Ş.', 733.50, 'FROTO'),
(13, 'Türkiye Garanti Bankası A.Ş.', 55.85, 'GARAN'),
(14, 'Gübre Fabrikaları T.A.Ş.', 172.60, 'GUBRF'),
(15, 'Hektaş Ticaret T.A.Ş.', 20.28, 'HEKTS'),
(16, 'Türkiye İş Bankası A.Ş.', 22.22, 'ISCTR'),
(17, 'Koç Holding A.Ş.', 137.60, 'KCHOL'),
(18, 'Kontrolmatik Teknoloji Enerji ve Mühendislik A.Ş.', 185.80, 'KONTR'),
(19, 'Koza Altın İşletmeleri A.Ş.', 18.84, 'KOZAL'),
(20, 'Kardemir Karabük Demir Çelik Sanayi ve Ticaret A.Ş', 22.30, 'KRDMD'),
(21, 'Odaş Elektrik Üretim Sanayi Ticaret A.Ş.', 7.61, 'ODAS'),
(22, 'Oyak Çimento Fabrikaları A.Ş. ', 54.10, 'OYAKC'),
(23, 'Petkim Petrokimya Holding A.Ş.', 17.44, 'PETKM'),
(24, 'Pegasus Hava Taşımacılığı A.Ş.', 652.50, 'PGSUS'),
(25, 'Hacı Ömer Sabancı Holding A.Ş.', 61.35, 'SAHOL'),
(26, 'Sasa Polyester Sanayi A.Ş.', 38.24, 'SASA'),
(27, 'Türkiye Şişe ve Cam Fabrikaları A.Ş.', 45.70, 'SISE'),
(28, 'Turkcell İletişim Hizmetleri A.Ş.', 52.65, 'TCELL'),
(29, 'Tofaş Türk Otomobil Fabrikası A.Ş. ', 208.20, 'TOASO'),
(30, 'TÜPRAŞ - Türkiye Petrol Rafinerileri A.Ş.', 141.80, 'TUPRS'),
(31, 'Yapı ve Kredi Bankası A.Ş.', 19.87, 'YKBNK');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kar`
--

DROP TABLE IF EXISTS `kar`;
CREATE TABLE IF NOT EXISTS `kar` (
  `kar_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_id` int(11) NOT NULL,
  `kar_son_ceyrek_tarih` date NOT NULL,
  `kar_son_ceyrek` int(11) NOT NULL,
  `kar_ilk_ceyrek_tarih` date NOT NULL,
  `kar_ilk_ceyrek` int(11) NOT NULL,
  `kar_degisim` int(11) NOT NULL,
  PRIMARY KEY (`kar_id`),
  KEY `hisse_id` (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `kar`
--

INSERT INTO `kar` (`kar_id`, `hisse_id`, `kar_son_ceyrek_tarih`, `kar_son_ceyrek`, `kar_ilk_ceyrek_tarih`, `kar_ilk_ceyrek`, `kar_degisim`) VALUES
(13, 1, '2023-09-01', 69503000, '2022-09-01', 38493000, 81),
(14, 3, '2023-09-01', -3867429, '2022-09-01', 14830340, -1),
(15, 4, '2023-09-01', 51469341, '2022-09-01', 38222869, 35),
(16, 5, '2023-09-01', 8894830, '2022-09-01', 7484442, 19),
(17, 6, '2023-09-01', 2567226, '2022-09-01', 1759931, 46),
(18, 7, '2023-09-01', 9801167, '2022-09-01', 5791966, 69),
(19, 8, '2023-09-01', 3043206, '2022-09-01', 1100291, 177),
(20, 9, '2023-09-01', 8048672, '2022-09-01', 4793018, 68),
(21, 10, '2023-09-01', 3684354, '2022-09-01', 2081458, 77),
(22, 11, '2023-09-01', 10026407, '2022-09-01', -3104342, -1),
(23, 12, '2023-09-01', 25093847, '2022-09-01', 10322171, 143),
(24, 13, '2023-09-01', 57217490, '2022-09-01', 38569816, 48),
(25, 14, '2023-09-01', 565107, '2022-09-01', 865718, -35),
(26, 15, '2023-09-01', 77351, '2022-09-01', 615948, -87),
(27, 16, '2023-09-01', 51855043, '2022-09-01', 37973995, 37),
(28, 17, '2023-09-01', 73675000, '2022-09-01', 42022329, 75),
(29, 18, '2023-09-01', 553691, '2022-09-01', 195027, 184),
(30, 19, '2023-09-01', 4516362, '2022-09-01', 3110258, 45),
(31, 19, '2023-09-01', 4516362, '2022-09-01', 3110258, 45),
(32, 21, '2023-09-01', 4616140, '2022-09-01', 2185111, 111),
(33, 22, '2023-09-01', 5489015, '2022-09-01', 1571579, 249),
(34, 23, '2023-09-01', 2706876, '2022-09-01', 5758039, -53),
(35, 24, '2023-09-01', 9046139, '2022-09-01', 2947671, 207),
(36, 25, '2023-09-01', 36674471, '2022-09-01', 27215356, 35),
(37, 26, '2023-09-01', 4645330, '2022-09-01', 8008417, -42),
(38, 27, '2023-09-01', 13359946, '2022-09-01', 13756479, -3),
(39, 28, '2023-09-01', 11456237, '2022-09-01', 5056940, 127),
(40, 29, '2023-09-01', 12465509, '2022-09-01', 5064329, 146),
(41, 30, '2023-09-01', 35271565, '2022-09-01', 23456118, 50),
(42, 31, '2023-09-01', 48702204, '2022-09-01', 35315448, 38);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kullanicilar`
--

DROP TABLE IF EXISTS `kullanicilar`;
CREATE TABLE IF NOT EXISTS `kullanicilar` (
  `kullanici_id` int(11) NOT NULL AUTO_INCREMENT,
  `adi` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `soyadi` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `tel_no` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`kullanici_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `kullanicilar`
--

INSERT INTO `kullanicilar` (`kullanici_id`, `adi`, `soyadi`, `email`, `password`, `tel_no`) VALUES
(1, 'tufan', 'sune', 'tufansune@gmail.com', '$2b$10$StxuEJjzOLiyrzy/LtyDv.F5HEfKQlRd2qqO1WfqeKY4VytFwoTm2', '5445509924'),
(2, 'okan', 'eskin', 'eskinokan@gmail.com', '$2b$10$3/DX.E.KEKGz9Q6jOnSbfO34AiKVpDXM74OiG1OEUHd.GVM7MPvZC', '5539727327'),
(3, 'akif', 'tatar', 'brkmrr9@gmail.com', '$2b$10$YVM7Wb0p6EAfrOsaAsBhGeTJgV4Am8/59B0OuSpc0/f/e2TPaLFfi', '5383519674'),
(4, 'mertcan', 'koç', 'mertcankoc@gmail.com', '$2b$10$SDi2phSy2IRkya5.s27QGeKTGX92rEMDcON4G9U4sHFhRT8I4lk82', '5468077159'),
(11, 'Özcan', 'Erikli', 'ozcanerikli@gmail.com', '$2b$10$426yvQDPssaFD2XAYiCKuOwyMuNs7Xmoynl3xwoY5V8kQeYf0KpBe', '5367711213'),
(23, 'emre', 'toptutan', 'emretoptutan@gmail.com', '$2b$10$AunZmphbLfSTy/aG02XnEevLnaSP.JIafhWe9h0BlRVo/4PJF6IYG', '5347727171'),
(24, 'furkan', 'deniz', 'furkandeniz@gmail.com', '$2b$10$zTHxoGKnj3sRqDPYvyjjierz2d67eGy/XwJiKBj1UODXym1qC/X..', '5444444444'),
(26, 'yılmaz', 'gökşen', 'yılmazgöksen@gmail.com', '$2b$10$IvhLapDoAmAwZR2FxBMPw.pbdK3D5Y8D5KSbqBJkLUGpCjpOA.UYy', '5353535353'),
(27, 'DENEME', 'DENEME', 'DENEME@gmail.com', '$2b$10$ORrgC4Ys2VJUtRrtJmqhV.72c480iB/RsbNjcc2G7/gy7XsecU5eK', '555555');

--
-- Tetikleyiciler `kullanicilar`
--
DROP TRIGGER IF EXISTS `yeni_kullanici`;
DELIMITER $$
CREATE TRIGGER `yeni_kullanici` AFTER INSERT ON `kullanicilar` FOR EACH ROW INSERT INTO trigger_kayıt (islem, adi,soyadi,email,tel_no,zaman) VALUES ("Yeni Kayıt", NEW.adi, NEW.soyadi,NEW.email,NEW.tel_no, NOW())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `net_borc`
--

DROP TABLE IF EXISTS `net_borc`;
CREATE TABLE IF NOT EXISTS `net_borc` (
  `net_borc_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_id` int(11) NOT NULL,
  `net_borc_son_ceyrek_tarih` date NOT NULL,
  `net_borc_son_ceyrek` int(11) NOT NULL,
  `net_borc_ilk_ceyrek_tarih` date NOT NULL,
  `net_borc_ilk_ceyrek` int(11) NOT NULL,
  `net_borc_degisim` int(11) NOT NULL,
  PRIMARY KEY (`net_borc_id`),
  KEY `hisse_id` (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `net_borc`
--

INSERT INTO `net_borc` (`net_borc_id`, `hisse_id`, `net_borc_son_ceyrek_tarih`, `net_borc_son_ceyrek`, `net_borc_ilk_ceyrek_tarih`, `net_borc_ilk_ceyrek`, `net_borc_degisim`) VALUES
(13, 1, '2023-09-01', 196328000, '2023-06-01', 210535000, -7),
(14, 3, '2023-09-01', 38309738, '2023-06-01', 32520581, 18),
(15, 4, '2023-09-01', -29926024, '2023-06-01', -27646746, -8),
(16, 5, '2023-09-01', -4470110, '2023-06-01', -4313414, -4),
(17, 6, '2023-09-01', 44184133, '2023-06-01', 40612620, 9),
(18, 7, '2023-09-01', 14738164, '2023-06-01', 13856507, 6),
(19, 8, '2023-09-01', -2364689, '2023-06-01', -1539701, -54),
(20, 9, '2023-09-01', 8850537, '2023-06-01', 10541081, -16),
(21, 10, '2023-09-01', -10773878, '2023-06-01', -6069560, -78),
(22, 11, '2023-09-01', -71457442, '2023-06-01', -63993259, -12),
(23, 12, '2023-09-01', 32659803, '2023-06-01', 34760343, -6),
(24, 13, '2023-09-01', -48956448, '2023-06-01', -48863132, 0),
(25, 14, '2023-09-01', 3707468, '2023-06-01', 6248226, -41),
(26, 15, '2023-09-01', 8307737, '2023-06-01', 7082862, 17),
(27, 16, '2023-09-01', -44262158, '2023-06-01', -44496908, -1),
(28, 17, '2023-09-01', 226529000, '2023-06-01', 191894000, 18),
(29, 18, '2023-09-01', 2011862, '2023-06-01', 1239836, 62),
(30, 19, '2023-09-01', -9561156, '2023-06-01', -11675349, -1),
(31, 20, '2023-09-01', -9561156, '2023-06-01', -11675349, -1),
(32, 21, '2023-09-01', -815278, '2023-06-01', 2838861, -1),
(33, 22, '2023-09-01', -3687010, '2023-06-01', -2045599, -80),
(34, 23, '2023-09-01', 25485257, '2023-06-01', 19574673, 30),
(35, 24, '2023-09-01', 64167337, '2023-06-01', 65456239, -2),
(36, 25, '2023-09-01', -4267673, '2023-06-01', -38137129, -1),
(37, 26, '2023-09-01', 52933495, '2023-06-01', 44456219, 19),
(38, 27, '2023-09-01', 36244129, '2023-06-01', 35318023, 3),
(39, 28, '2023-09-01', 30996947, '2023-06-01', 31723759, -2),
(40, 29, '2023-09-01', -13224109, '2023-06-01', -9090788, -45),
(41, 30, '2023-09-01', -53265801, '2023-06-01', -10089289, -428),
(42, 31, '2023-09-01', -42834636, '2023-06-01', -41576258, -3);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ozkaynaklar`
--

DROP TABLE IF EXISTS `ozkaynaklar`;
CREATE TABLE IF NOT EXISTS `ozkaynaklar` (
  `ozkaynaklar_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_id` int(11) NOT NULL,
  `ozkaynaklar_son_ceyrek_tarih` date NOT NULL,
  `ozkaynaklar_son_ceyrek` int(11) NOT NULL,
  `ozkaynaklar_ilk_ceyrek_tarih` date NOT NULL,
  `ozkaynaklar_ilk_ceyrek` int(11) NOT NULL,
  `ozkaynaklar_degisim` int(11) NOT NULL,
  PRIMARY KEY (`ozkaynaklar_id`),
  KEY `hisse_id` (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `ozkaynaklar`
--

INSERT INTO `ozkaynaklar` (`ozkaynaklar_id`, `hisse_id`, `ozkaynaklar_son_ceyrek_tarih`, `ozkaynaklar_son_ceyrek`, `ozkaynaklar_ilk_ceyrek_tarih`, `ozkaynaklar_ilk_ceyrek`, `ozkaynaklar_degisim`) VALUES
(13, 1, '2023-09-01', 343276000, '2023-06-01', 268764000, 28),
(14, 3, '2023-09-01', 161817534, '2023-06-01', 152778104, 6),
(15, 4, '2023-09-01', 190038816, '2023-06-01', 169547088, 12),
(16, 5, '2023-09-01', 23421478, '2023-06-01', 19512372, 20),
(17, 6, '2023-09-01', 32940363, '2023-06-01', 31190093, 6),
(18, 7, '2023-09-01', 49024724, '2023-06-01', 44627733, 10),
(19, 8, '2023-09-01', 7649441, '2023-06-01', 6177447, 24),
(20, 9, '2023-09-01', 29804484, '2023-06-01', 25929677, 15),
(21, 10, '2023-09-01', 22218578, '2023-06-01', 19740478, 13),
(22, 11, '2023-09-01', 175705501, '2023-06-01', 165079997, 6),
(23, 12, '2023-09-01', 40506560, '2023-06-01', 27291462, 48),
(24, 13, '2023-09-01', 215395578, '2023-06-01', 188531873, 14),
(25, 14, '2023-09-01', 7085120, '2023-06-01', 5934610, 19),
(26, 15, '2023-09-01', 3620572, '2023-06-01', 3362449, 8),
(27, 16, '2023-09-01', 249674114, '2023-06-01', 233387097, 7),
(28, 17, '2023-09-01', 214138000, '2023-06-01', 180508000, 19),
(29, 18, '2023-09-01', 1934491, '2023-06-01', 1448113, 34),
(30, 19, '2023-09-01', 14080719, '2023-06-01', 13722834, 3),
(31, 19, '2023-09-01', 14080719, '2023-06-01', 13722834, 3),
(32, 21, '2023-09-01', 7674994, '2023-06-01', 4373337, 75),
(33, 22, '2023-09-01', 12827954, '2023-06-01', 10188174, 26),
(34, 23, '2023-09-01', 21533202, '2023-06-01', 19146141, 12),
(35, 24, '2023-09-01', 35480133, '2023-06-01', 26823285, 32),
(36, 25, '2023-09-01', 139294243, '2023-06-01', 117862065, 18),
(37, 26, '2023-09-01', 29054563, '2023-06-01', 17052799, 70),
(38, 27, '2023-09-01', 93967108, '2023-06-01', 89577377, 5),
(39, 28, '2023-09-01', 40973399, '2023-06-01', 37532036, 9),
(40, 29, '2023-09-01', 21230537, '2023-06-01', 15857905, 34),
(41, 30, '2023-09-01', 71853782, '2023-06-01', 67775033, 6),
(42, 31, '2023-09-01', 162232676, '2023-06-01', 139271813, 16);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `portfoy`
--

DROP TABLE IF EXISTS `portfoy`;
CREATE TABLE IF NOT EXISTS `portfoy` (
  `portfoy_id` int(11) NOT NULL AUTO_INCREMENT,
  `kullanici_id` int(11) NOT NULL,
  `bakiye` float(11,2) NOT NULL,
  PRIMARY KEY (`portfoy_id`),
  KEY `kullanici_id` (`kullanici_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `portfoy`
--

INSERT INTO `portfoy` (`portfoy_id`, `kullanici_id`, `bakiye`) VALUES
(1, 1, 970807.00),
(2, 2, 245653.00),
(3, 3, 946607.00);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `portfoy_hisse`
--

DROP TABLE IF EXISTS `portfoy_hisse`;
CREATE TABLE IF NOT EXISTS `portfoy_hisse` (
  `hisse_id` int(11) NOT NULL,
  `portfoy_id` int(11) NOT NULL,
  `hisse_adet` int(11) NOT NULL,
  KEY `hisse_id` (`hisse_id`),
  KEY `portfoy_id` (`portfoy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `portfoy_hisse`
--

INSERT INTO `portfoy_hisse` (`hisse_id`, `portfoy_id`, `hisse_adet`) VALUES
(1, 1, 1000),
(6, 1, 800),
(17, 1, 400),
(14, 1, 600),
(3, 2, 600),
(1, 2, 500),
(25, 2, 900),
(25, 1, 450),
(30, 2, 250),
(4, 1, 100);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `satislar`
--

DROP TABLE IF EXISTS `satislar`;
CREATE TABLE IF NOT EXISTS `satislar` (
  `satislar_id` int(11) NOT NULL AUTO_INCREMENT,
  `hisse_id` int(11) NOT NULL,
  `satislar_son_ceyrek_tarih` date NOT NULL,
  `satislar_son_ceyrek` int(11) NOT NULL,
  `satislar_ilk_ceyrek_tarih` date NOT NULL,
  `satislar_ilk_ceyrek` int(11) NOT NULL,
  `satislar_degisim` int(11) NOT NULL,
  PRIMARY KEY (`satislar_id`),
  KEY `hisse_id` (`hisse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `satislar`
--

INSERT INTO `satislar` (`satislar_id`, `hisse_id`, `satislar_son_ceyrek_tarih`, `satislar_son_ceyrek`, `satislar_ilk_ceyrek_tarih`, `satislar_ilk_ceyrek`, `satislar_degisim`) VALUES
(10, 1, '2023-09-01', 358781000, '2022-09-01', 223120000, 61),
(11, 3, '2023-09-01', 101010326, '2022-09-01', 100535316, 0),
(12, 4, '2023-09-01', 149517362, '2022-09-01', 85539153, 75),
(13, 5, '2023-09-01', 6072564, '2022-09-01', 5072173, 20),
(14, 6, '2023-09-01', 145057302, '2022-09-01', 94723628, 53),
(15, 7, '2023-09-01', 32066743, '2022-09-01', 17728397, 81),
(16, 8, '2023-09-01', 8882635, '2022-09-01', 4626151, 92),
(17, 9, '2023-09-01', 183618341, '2022-09-01', 102323018, 79),
(18, 10, '2023-09-01', 12134387, '2022-09-01', 5677656, 114),
(19, 11, '2023-09-01', 55676473, '2022-09-01', 44243665, 26),
(20, 12, '2023-09-01', 225960890, '2022-09-01', 110857477, 104),
(21, 13, '2023-09-01', 144976380, '2022-09-01', 87761397, 65),
(22, 14, '2023-09-01', 20534974, '2022-09-01', 19898030, 3),
(23, 15, '2023-09-01', 4079316, '2022-09-01', 4060633, 0),
(24, 16, '2023-09-01', 163143084, '2022-09-01', 98102406, 66),
(25, 17, '2023-09-01', 677056000, '2022-09-01', 535749021, 26),
(26, 18, '2023-09-01', 1801833, '2022-09-01', 855407, 111),
(27, 19, '2023-09-01', 5101117, '2022-09-01', 4648507, 10),
(28, 19, '2023-09-01', 5101117, '2022-09-01', 4648507, 10),
(29, 21, '2023-09-01', 4554965, '2022-09-01', 4813499, -5),
(30, 22, '2023-09-01', 15537252, '2022-09-01', 8185945, 90),
(31, 23, '2023-09-01', 32998975, '2022-09-01', 39990292, -17),
(32, 24, '2023-09-01', 51974988, '2022-09-01', 30255091, 72),
(33, 25, '2023-09-01', 81583840, '2022-09-01', 46517068, 75),
(34, 26, '2023-09-01', 26485413, '2022-09-01', 24037130, 10),
(35, 27, '2023-09-01', 94840349, '2022-09-01', 66279449, 43),
(36, 28, '2023-09-01', 62697062, '2022-09-01', 36662519, 71),
(37, 29, '2023-09-01', 68767699, '2022-09-01', 42071432, 63),
(38, 30, '2023-09-01', 382368716, '2022-09-01', 365738864, 5),
(39, 31, '2023-09-01', 150620708, '2022-09-01', 85291482, 77);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `trigger_kayıt`
--

DROP TABLE IF EXISTS `trigger_kayıt`;
CREATE TABLE IF NOT EXISTS `trigger_kayıt` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `islem` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `adi` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `soyadi` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_turkish_ci NOT NULL,
  `tel_no` varchar(11) COLLATE utf8_turkish_ci NOT NULL,
  `zaman` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `trigger_kayıt`
--

INSERT INTO `trigger_kayıt` (`id`, `islem`, `adi`, `soyadi`, `email`, `tel_no`, `zaman`) VALUES
(4, 'Yeni Kayıt', 'Özcan', 'Erikli', 'ozcanerikli3@gmail.com', '5367711213', '2023-12-18 18:10:31'),
(6, 'Yeni Kayıt', 'emre', 'toptutan', 'emretoptutan@gmail.com', '5347727171', '2023-12-19 12:32:00'),
(7, 'Yeni Kayıt', 'irfan', 'koca', 'irfankoca@gmail.com', '23213213', '2023-12-19 14:09:33'),
(8, 'Yeni Kayıt', 'furkan', 'deniz', 'furkandeniz@gmail.com', '5444444444', '2023-12-22 22:21:15'),
(10, 'Yeni Kayıt', 'yılmaz', 'gökşen', 'yılmazgöksen@gmail.com', '5353535353', '2023-12-26 05:01:34'),
(11, 'Yeni Kayıt', 'DENEME', 'DENEME', 'DENEME@gmail.com', '555555', '2023-12-26 09:43:44');

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `favok`
--
ALTER TABLE `favok`
  ADD CONSTRAINT `favok_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `kar`
--
ALTER TABLE `kar`
  ADD CONSTRAINT `kar_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `net_borc`
--
ALTER TABLE `net_borc`
  ADD CONSTRAINT `net_borc_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `ozkaynaklar`
--
ALTER TABLE `ozkaynaklar`
  ADD CONSTRAINT `ozkaynaklar_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `portfoy`
--
ALTER TABLE `portfoy`
  ADD CONSTRAINT `portfoy_ibfk_1` FOREIGN KEY (`kullanici_id`) REFERENCES `kullanicilar` (`kullanici_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `portfoy_hisse`
--
ALTER TABLE `portfoy_hisse`
  ADD CONSTRAINT `portfoy_hisse_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `portfoy_hisse_ibfk_2` FOREIGN KEY (`portfoy_id`) REFERENCES `portfoy` (`portfoy_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `satislar`
--
ALTER TABLE `satislar`
  ADD CONSTRAINT `satislar_ibfk_1` FOREIGN KEY (`hisse_id`) REFERENCES `hisseler` (`hisse_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
