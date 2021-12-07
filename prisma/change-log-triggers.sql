DROP TRIGGER IF EXISTS tree_change_log_update;
DROP TRIGGER IF EXISTS tree_change_log_create;

CREATE TRIGGER tree_change_log_update 
AFTER UPDATE ON Tree 
FOR EACH ROW 
BEGIN 
IF new.name <> old.name THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.name,
        new.name,
        'name',
        now(),
        'Update'
    );
END IF;
IF new.pictureUrl <> old.pictureUrl THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.pictureUrl,
        new.pictureUrl,
        'pictureUrl',
        now(),
        'Update'
    );
END IF;

IF new.latitude <> old.latitude THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.latitude,
        new.latitude,
        'latitude',
        now(),
        'Update'
    );
END IF;
IF new.longitude <> old.longitude THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.longitude,
        new.longitude,
        'longitude',
        now(),
        'Update'
    );
END IF;
IF new.diameter <> old.diameter THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.diameter,
        new.diameter,
        'diameter',
        now(),
        'Update'
    );
END IF;
IF new.height <> old.height THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.height,
        new.height,
        'height',
        now(),
        'Update'
    );
END IF;
IF new.speciesId <> old.speciesId THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.speciesId,
        new.speciesId,
        'speciesId',
        now(),
        'Update'
    );
END IF;

IF new.identificationConfidence <> old.identificationConfidence THEN
INSERT INTO
    TreeChangeLog (
        treeId,
        userId,
        oldValue,
        newValue,
        attribute,
        createdDate,
        type
    )
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        old.identificationConfidence,
        new.identificationConfidence,
        'identificationConfidence',
        now(),
        'Update'
    );
END IF;
END; 

CREATE TRIGGER tree_change_log_create
AFTER INSERT ON Tree 
FOR EACH ROW 
BEGIN
INSERT INTO
    TreeChangeLog (treeId, userId, createdDate, type)
VALUES
    (
        new.id,
        new.lastChangedByUserId,
        now(),
        'Create'
    );
END