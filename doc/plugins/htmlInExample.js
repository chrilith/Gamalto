
var tags = ["examples"];
var hasOwnProp = Object.prototype.hasOwnProperty;

function parse(str) {
	// tags always starts with letters or !
	return str.replace(/<(\/?[!a-zA-Z]+?)/g, "&lt;$1");
}

function process(doclet) {
    tags.forEach(function(tag) {
        if ( !hasOwnProp.call(doclet, tag) ) {
            return;
        }

        if (typeof doclet[tag] === 'string') {
            doclet[tag] = parse(doclet[tag]);

        } else if (Array.isArray(doclet[tag])) {
            doclet[tag].forEach(function(value, index, original) {
                var inner = {};
                inner[tag] = value;
                process(inner);
                original[index] = inner[tag];
            });
        
        } else if (doclet[tag]) {
            process(doclet[tag]);
        }
    });
}

exports.handlers = {
    /**
     * Translate HTML syntax in a new doclet's example into a proper format. Is run
     * by JSDoc 3 whenever a "newDoclet" event fires.
     */
    newDoclet: function(e) {
        process(e.doclet);
    }
};