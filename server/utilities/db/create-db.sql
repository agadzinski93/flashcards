DROP DATABASE IF EXISTS flashcards;
CREATE DATABASE flashcards;
USE flashcards;
CREATE TABLE users(
	id INT PRIMARY KEY AUTO_INCREMENT,
    username CHAR(24) UNIQUE NOT NULL,
    email CHAR(45) UNIQUE NOT NULL,
    accountStatus ENUM('active','pending','disabled','banned') NOT NULL DEFAULT 'pending',
    profilePic VARCHAR(145) NOT NULL DEFAULT "https://res.cloudinary.com/dlv7hwwa7/image/upload/v1677570982/Programminghelp/profile-pic-default_ggecfy.jpg",
    numOfDecks INT NOT NULL DEFAULT 0,
    timeCreated TIMESTAMP NOT NULL DEFAULT NOW()
)ENGINE=InnoDB CHAR SET 'utf8mb4';

CREATE TABLE registration(
    userId INT PRIMARY KEY UNIQUE NOT NULL,
    activationKey CHAR(145) NOT NULL,
    complete TINYINT NOT NULL DEFAULT FALSE,
    expiration DATETIME NOT NULL DEFAULT (NOW() + INTERVAL 1 DAY),
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB CHAR SET 'utf8mb4';

CREATE TABLE decks(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(24) NOT NULL,
    userId INT NOT NULL,
    authorId INT DEFAULT NULL,
    difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
    prerequisite INT DEFAULT NULL,
    numOfCards INT NOT NULL DEFAULT 0,
    timeCreated TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (prerequisite) REFERENCES decks(id) ON UPDATE CASCADE ON DELETE SET NULL
)ENGINE=InnoDB CHAR SET 'utf8mb4';

CREATE TABLE cards(
	id INT PRIMARY KEY AUTO_INCREMENT,
    textClue VARCHAR(1024) NOT NULL,
    textAnswer VARCHAR(2048) NOT NULL,
    authorId INT DEFAULT NULL,
    userId INT NOT NULL,
    deckId INT NOT NULL,
    caseSensitive TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (authorId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (deckId) REFERENCES decks(id) ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB CHAR SET 'utf8mb4';

DROP PROCEDURE IF EXISTS registerUser;
DELIMITER //
CREATE PROCEDURE registerUser(IN u CHAR(24),IN e CHAR(45))
BEGIN
	DECLARE sql_error TINYINT DEFAULT FALSE;
    BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			SET sql_error = TRUE;
        START TRANSACTION;
		INSERT INTO users(username,email) VALUES(u,e);
    END;
    IF sql_error = TRUE THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Error Registering User";
    ELSE
		  COMMIT;
    END IF;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS verifyEmail;
DELIMITER //
CREATE PROCEDURE verifyEmail(IN user INT,IN code CHAR(145))
BEGIN
	DECLARE sql_error TINYINT DEFAULT FALSE;
    DECLARE input_error TINYINT DEFAULT FALSE;
    DECLARE msg VARCHAR(50);
    DECLARE status CHAR(10);
    BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			SET sql_error = TRUE;
		START TRANSACTION;
        SELECT accountStatus INTO status FROM users WHERE id = user;
        IF status != 'pending' THEN
			SET input_error = TRUE;
            SET msg = "Email already verified.";
        ELSE
			IF code = (SELECT activationKey FROM registration WHERE userId = user) THEN
				UPDATE users SET accountStatus = 'active' WHERE id = user;
                UPDATE registration SET complete = TRUE WHERE userId = user;
            ELSE
				SET input_error = TRUE;
                SET msg = "Keys do not match.";
            END IF;
        END IF;
    END;
	IF sql_error = TRUE THEN
		ROLLBACK;
        SET msg = "Couldn\'t Verify Email.";
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    ELSEIF input_error = TRUE THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    ELSE
		COMMIT;
    END IF;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS createDeck;
DELIMITER //
CREATE PROCEDURE createDeck(IN deckName CHAR(24),IN deckOwner INT, IN deckAuthor INT, IN deckDifficulty ENUM('','beginner','intermediate','advanced'), IN prereq INT)
BEGIN
	BEGIN
		DECLARE sql_error TINYINT DEFAULT FALSE;
		BEGIN
			DECLARE EXIT HANDLER FOR SQLEXCEPTION
				SET sql_error = TRUE;
				
			START TRANSACTION;
            IF deckDifficulty = '' THEN
				SET deckDifficulty = 'beginner';
            END IF;
            IF prereq = '' THEN
				INSERT INTO decks(name,userId,authorId,difficulty,prerequisite) VALUES(deckName,deckOwner,deckAuthor,deckDifficulty);
			ELSE
				INSERT INTO decks(name,userId,authorId,difficulty,prerequisite) VALUES(deckName,deckOwner,deckAuthor,deckDifficulty,prereq);
            END IF;
		END;
		IF sql_error = TRUE THEN
			ROLLBACK;
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Error Creating Deck";
		ELSE
			COMMIT;
		END IF;
	END;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS createCard;
DELIMITER //
CREATE PROCEDURE createCard(IN clue VARCHAR(1024), IN answer VARCHAR(2048), IN deck INT, IN author INT, IN user INT, IN caseSen TINYINT)
BEGIN
	DECLARE sql_error TINYINT DEFAULT FALSE;
    BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			SET sql_error = TRUE;
			
        START TRANSACTION;
        INSERT INTO cards(textClue,textAnswer,deckId,authorId,userId,caseSensitive) VALUES(clue,answer,deck,author,user,caseSen);
    END;
    IF sql_error = TRUE THEN
		ROLLBACK;
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Error Creating Card";
    ELSE
		  COMMIT;
    END IF;
END//
DELIMITER ;

DROP TRIGGER IF EXISTS addDeck;
DELIMITER //
CREATE TRIGGER addDeck
AFTER INSERT ON decks
FOR EACH ROW
BEGIN
	UPDATE users SET numOfDecks = numOfDecks + 1 WHERE username = NEW.userId;
END//
DELIMITER ;

DROP TRIGGER IF EXISTS removeDeck;
DELIMITER //
CREATE TRIGGER removeDeck
BEFORE DELETE ON decks
FOR EACH ROW
BEGIN
	UPDATE users SET numOfDecks = numOfDecksecks - 1 WHERE username = OLD.userId;
END//
DELIMITER ;

DROP EVENT IF EXISTS scanRegistrationKeys;
DELIMITER //
CREATE EVENT scanRegistrationKeys
ON SCHEDULE EVERY 1 DAY
STARTS NOW()
DO BEGIN
	DECLARE sql_error TINYINT DEFAULT FALSE;
    BEGIN
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			SET sql_error = TRUE;
		START TRANSACTION;
		DELETE FROM users WHERE id IN (SELECT userId FROM registration WHERE NOW() > expiration) AND account_status = 'pending';
        DELETE FROM flashcards.registration WHERE NOW() > expiration;
    END;
    IF sql_error = TRUE THEN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error Deleting Expired Keys';
    ELSE
		COMMIT;
    END IF;
END//
DELIMITER ;