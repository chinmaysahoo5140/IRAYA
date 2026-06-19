var lib = {};
var Utility = {};
var hasRequiredUtility;
function requireUtility() {
  if (hasRequiredUtility) return Utility;
  hasRequiredUtility = 1;
  (function() {
    var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, hasProp = {}.hasOwnProperty;
    assign = function(target, ...sources) {
      var i, key, len, source;
      if (isFunction(Object.assign)) {
        Object.assign.apply(null, arguments);
      } else {
        for (i = 0, len = sources.length; i < len; i++) {
          source = sources[i];
          if (source != null) {
            for (key in source) {
              if (!hasProp.call(source, key)) continue;
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
    isFunction = function(val) {
      return !!val && Object.prototype.toString.call(val) === "[object Function]";
    };
    isObject = function(val) {
      var ref;
      return !!val && ((ref = typeof val) === "function" || ref === "object");
    };
    isArray = function(val) {
      if (isFunction(Array.isArray)) {
        return Array.isArray(val);
      } else {
        return Object.prototype.toString.call(val) === "[object Array]";
      }
    };
    isEmpty = function(val) {
      var key;
      if (isArray(val)) {
        return !val.length;
      } else {
        for (key in val) {
          if (!hasProp.call(val, key)) continue;
          return false;
        }
        return true;
      }
    };
    isPlainObject = function(val) {
      var ctor, proto;
      return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
    };
    getValue = function(obj) {
      if (isFunction(obj.valueOf)) {
        return obj.valueOf();
      } else {
        return obj;
      }
    };
    Utility.assign = assign;
    Utility.isFunction = isFunction;
    Utility.isObject = isObject;
    Utility.isArray = isArray;
    Utility.isEmpty = isEmpty;
    Utility.isPlainObject = isPlainObject;
    Utility.getValue = getValue;
  }).call(Utility);
  return Utility;
}
var XMLDOMImplementation$1 = { exports: {} };
var XMLDOMImplementation = XMLDOMImplementation$1.exports;
var hasRequiredXMLDOMImplementation;
function requireXMLDOMImplementation() {
  if (hasRequiredXMLDOMImplementation) return XMLDOMImplementation$1.exports;
  hasRequiredXMLDOMImplementation = 1;
  (function() {
    XMLDOMImplementation$1.exports = class XMLDOMImplementation {
      // Tests if the DOM implementation implements a specific feature.
      // `feature` package name of the feature to test. In Level 1, the
      //           legal values are "HTML" and "XML" (case-insensitive).
      // `version` version number of the package name to test. 
      //           In Level 1, this is the string "1.0". If the version is 
      //           not specified, supporting any version of the feature will 
      //           cause the method to return true.
      hasFeature(feature, version) {
        return true;
      }
      // Creates a new document type declaration.
      // `qualifiedName` qualified name of the document type to be created
      // `publicId` public identifier of the external subset
      // `systemId` system identifier of the external subset
      createDocumentType(qualifiedName, publicId, systemId) {
        throw new Error("This DOM method is not implemented.");
      }
      // Creates a new document.
      // `namespaceURI` namespace URI of the document element to create
      // `qualifiedName` the qualified name of the document to be created
      // `doctype` the type of document to be created or null
      createDocument(namespaceURI, qualifiedName, doctype) {
        throw new Error("This DOM method is not implemented.");
      }
      // Creates a new HTML document.
      // `title` document title
      createHTMLDocument(title) {
        throw new Error("This DOM method is not implemented.");
      }
      // Returns a specialized object which implements the specialized APIs 
      // of the specified feature and version.
      // `feature` name of the feature requested.
      // `version` version number of the feature to test
      getFeature(feature, version) {
        throw new Error("This DOM method is not implemented.");
      }
    };
  }).call(XMLDOMImplementation);
  return XMLDOMImplementation$1.exports;
}
var XMLDocument$1 = { exports: {} };
var XMLDOMConfiguration$1 = { exports: {} };
var XMLDOMErrorHandler$1 = { exports: {} };
var XMLDOMErrorHandler = XMLDOMErrorHandler$1.exports;
var hasRequiredXMLDOMErrorHandler;
function requireXMLDOMErrorHandler() {
  if (hasRequiredXMLDOMErrorHandler) return XMLDOMErrorHandler$1.exports;
  hasRequiredXMLDOMErrorHandler = 1;
  (function() {
    XMLDOMErrorHandler$1.exports = class XMLDOMErrorHandler {
      // Initializes a new instance of `XMLDOMErrorHandler`
      constructor() {
      }
      // Called on the error handler when an error occurs.
      // `error` the error message as a string
      handleError(error) {
        throw new Error(error);
      }
    };
  }).call(XMLDOMErrorHandler);
  return XMLDOMErrorHandler$1.exports;
}
var XMLDOMStringList$1 = { exports: {} };
var XMLDOMStringList = XMLDOMStringList$1.exports;
var hasRequiredXMLDOMStringList;
function requireXMLDOMStringList() {
  if (hasRequiredXMLDOMStringList) return XMLDOMStringList$1.exports;
  hasRequiredXMLDOMStringList = 1;
  (function() {
    XMLDOMStringList$1.exports = (function() {
      class XMLDOMStringList2 {
        // Initializes a new instance of `XMLDOMStringList`
        // This is just a wrapper around an ordinary
        // JS array.
        // `arr` the array of string values
        constructor(arr) {
          this.arr = arr || [];
        }
        // Returns the indexth item in the collection.
        // `index` index into the collection
        item(index) {
          return this.arr[index] || null;
        }
        // Test if a string is part of this DOMStringList.
        // `str` the string to look for
        contains(str) {
          return this.arr.indexOf(str) !== -1;
        }
      }
      Object.defineProperty(XMLDOMStringList2.prototype, "length", {
        get: function() {
          return this.arr.length;
        }
      });
      return XMLDOMStringList2;
    }).call(this);
  }).call(XMLDOMStringList);
  return XMLDOMStringList$1.exports;
}
var XMLDOMConfiguration = XMLDOMConfiguration$1.exports;
var hasRequiredXMLDOMConfiguration;
function requireXMLDOMConfiguration() {
  if (hasRequiredXMLDOMConfiguration) return XMLDOMConfiguration$1.exports;
  hasRequiredXMLDOMConfiguration = 1;
  (function() {
    var XMLDOMErrorHandler2, XMLDOMStringList2;
    XMLDOMErrorHandler2 = requireXMLDOMErrorHandler();
    XMLDOMStringList2 = requireXMLDOMStringList();
    XMLDOMConfiguration$1.exports = (function() {
      class XMLDOMConfiguration2 {
        constructor() {
          this.defaultParams = {
            "canonical-form": false,
            "cdata-sections": false,
            "comments": false,
            "datatype-normalization": false,
            "element-content-whitespace": true,
            "entities": true,
            "error-handler": new XMLDOMErrorHandler2(),
            "infoset": true,
            "validate-if-schema": false,
            "namespaces": true,
            "namespace-declarations": true,
            "normalize-characters": false,
            "schema-location": "",
            "schema-type": "",
            "split-cdata-sections": true,
            "validate": false,
            "well-formed": true
          };
          this.params = Object.create(this.defaultParams);
        }
        // Gets the value of a parameter.
        // `name` name of the parameter
        getParameter(name) {
          if (this.params.hasOwnProperty(name)) {
            return this.params[name];
          } else {
            return null;
          }
        }
        // Checks if setting a parameter to a specific value is supported.
        // `name` name of the parameter
        // `value` parameter value
        canSetParameter(name, value) {
          return true;
        }
        // Sets the value of a parameter.
        // `name` name of the parameter
        // `value` new value or null if the user wishes to unset the parameter
        setParameter(name, value) {
          if (value != null) {
            return this.params[name] = value;
          } else {
            return delete this.params[name];
          }
        }
      }
      Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
        get: function() {
          return new XMLDOMStringList2(Object.keys(this.defaultParams));
        }
      });
      return XMLDOMConfiguration2;
    }).call(this);
  }).call(XMLDOMConfiguration);
  return XMLDOMConfiguration$1.exports;
}
var XMLNode$1 = { exports: {} };
var XMLElement$1 = { exports: {} };
var NodeType$1 = { exports: {} };
var NodeType = NodeType$1.exports;
var hasRequiredNodeType;
function requireNodeType() {
  if (hasRequiredNodeType) return NodeType$1.exports;
  hasRequiredNodeType = 1;
  (function() {
    NodeType$1.exports = {
      Element: 1,
      Attribute: 2,
      Text: 3,
      CData: 4,
      EntityReference: 5,
      EntityDeclaration: 6,
      ProcessingInstruction: 7,
      Comment: 8,
      Document: 9,
      DocType: 10,
      DocumentFragment: 11,
      NotationDeclaration: 12,
      // Numeric codes up to 200 are reserved to W3C for possible future use.
      // Following are types internal to this library:
      Declaration: 201,
      Raw: 202,
      AttributeDeclaration: 203,
      ElementDeclaration: 204,
      Dummy: 205
    };
  }).call(NodeType);
  return NodeType$1.exports;
}
var XMLAttribute$1 = { exports: {} };
var XMLAttribute = XMLAttribute$1.exports;
var hasRequiredXMLAttribute;
function requireXMLAttribute() {
  if (hasRequiredXMLAttribute) return XMLAttribute$1.exports;
  hasRequiredXMLAttribute = 1;
  (function() {
    var NodeType2;
    NodeType2 = requireNodeType();
    requireXMLNode();
    XMLAttribute$1.exports = (function() {
      class XMLAttribute2 {
        // Initializes a new instance of `XMLAttribute`
        // `parent` the parent node
        // `name` attribute target
        // `value` attribute value
        constructor(parent, name, value) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.value = this.stringify.attValue(value);
          this.type = NodeType2.Attribute;
          this.isId = false;
          this.schemaTypeInfo = null;
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
        }
        // Returns debug string for this node
        debugInfo(name) {
          name = name || this.name;
          if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else {
            return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
          }
        }
        isEqualNode(node) {
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.value !== this.value) {
            return false;
          }
          return true;
        }
      }
      Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
        get: function() {
          return this.type;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
        get: function() {
          return this.parent;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "textContent", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "prefix", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "localName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLAttribute2.prototype, "specified", {
        get: function() {
          return true;
        }
      });
      return XMLAttribute2;
    }).call(this);
  }).call(XMLAttribute);
  return XMLAttribute$1.exports;
}
var XMLNamedNodeMap$1 = { exports: {} };
var XMLNamedNodeMap = XMLNamedNodeMap$1.exports;
var hasRequiredXMLNamedNodeMap;
function requireXMLNamedNodeMap() {
  if (hasRequiredXMLNamedNodeMap) return XMLNamedNodeMap$1.exports;
  hasRequiredXMLNamedNodeMap = 1;
  (function() {
    XMLNamedNodeMap$1.exports = (function() {
      class XMLNamedNodeMap2 {
        // Initializes a new instance of `XMLNamedNodeMap`
        // This is just a wrapper around an ordinary
        // JS object.
        // `nodes` the object containing nodes.
        constructor(nodes) {
          this.nodes = nodes;
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return this.nodes = null;
        }
        // DOM Level 1
        getNamedItem(name) {
          return this.nodes[name];
        }
        setNamedItem(node) {
          var oldNode;
          oldNode = this.nodes[node.nodeName];
          this.nodes[node.nodeName] = node;
          return oldNode || null;
        }
        removeNamedItem(name) {
          var oldNode;
          oldNode = this.nodes[name];
          delete this.nodes[name];
          return oldNode || null;
        }
        item(index) {
          return this.nodes[Object.keys(this.nodes)[index]] || null;
        }
        // DOM level 2 functions to be implemented later
        getNamedItemNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        }
        setNamedItemNS(node) {
          throw new Error("This DOM method is not implemented.");
        }
        removeNamedItemNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        }
      }
      Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
        get: function() {
          return Object.keys(this.nodes).length || 0;
        }
      });
      return XMLNamedNodeMap2;
    }).call(this);
  }).call(XMLNamedNodeMap);
  return XMLNamedNodeMap$1.exports;
}
var XMLElement = XMLElement$1.exports;
var hasRequiredXMLElement;
function requireXMLElement() {
  if (hasRequiredXMLElement) return XMLElement$1.exports;
  hasRequiredXMLElement = 1;
  (function() {
    var NodeType2, XMLAttribute2, XMLNamedNodeMap2, XMLNode2, getValue, isFunction, isObject, hasProp = {}.hasOwnProperty;
    ({ isObject, isFunction, getValue } = requireUtility());
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLAttribute2 = requireXMLAttribute();
    XMLNamedNodeMap2 = requireXMLNamedNodeMap();
    XMLElement$1.exports = (function() {
      class XMLElement2 extends XMLNode2 {
        // Initializes a new instance of `XMLElement`
        // `parent` the parent node
        // `name` element name
        // `attributes` an object containing name/value pairs of attributes
        constructor(parent, name, attributes) {
          var child, j, len, ref;
          super(parent);
          if (name == null) {
            throw new Error("Missing element name. " + this.debugInfo());
          }
          this.name = this.stringify.name(name);
          this.type = NodeType2.Element;
          this.attribs = {};
          this.schemaTypeInfo = null;
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.type === NodeType2.Document) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
            if (parent.children) {
              ref = parent.children;
              for (j = 0, len = ref.length; j < len; j++) {
                child = ref[j];
                if (child.type === NodeType2.DocType) {
                  child.name = this.name;
                  break;
                }
              }
            }
          }
        }
        // Creates and returns a deep clone of `this`
        clone() {
          var att, attName, clonedSelf, ref;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attribs = {};
          ref = this.attribs;
          for (attName in ref) {
            if (!hasProp.call(ref, attName)) continue;
            att = ref[attName];
            clonedSelf.attribs[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        }
        // Adds or modifies an attribute
        // `name` attribute name
        // `value` attribute value
        attribute(name, value) {
          var attName, attValue;
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.attribs[name] = new XMLAttribute2(this, name, "");
            } else if (value != null) {
              this.attribs[name] = new XMLAttribute2(this, name, value);
            }
          }
          return this;
        }
        // Removes an attribute
        // `name` attribute name
        removeAttribute(name) {
          var attName, j, len;
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo());
          }
          name = getValue(name);
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              attName = name[j];
              delete this.attribs[attName];
            }
          } else {
            delete this.attribs[name];
          }
          return this;
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        // `options.allowEmpty` do not self close empty element tags
        toString(options) {
          return this.options.writer.element(this, this.options.writer.filterOptions(options));
        }
        // Aliases
        att(name, value) {
          return this.attribute(name, value);
        }
        a(name, value) {
          return this.attribute(name, value);
        }
        // DOM Level 1
        getAttribute(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].value;
          } else {
            return null;
          }
        }
        setAttribute(name, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getAttributeNode(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name];
          } else {
            return null;
          }
        }
        setAttributeNode(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        removeAttributeNode(oldAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByTagName(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM Level 2
        getAttributeNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        setAttributeNS(namespaceURI, qualifiedName, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        removeAttributeNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getAttributeNodeNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        setAttributeNodeNS(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByTagNameNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        hasAttribute(name) {
          return this.attribs.hasOwnProperty(name);
        }
        hasAttributeNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM Level 3
        setIdAttribute(name, isId) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].isId;
          } else {
            return isId;
          }
        }
        setIdAttributeNS(namespaceURI, localName, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        setIdAttributeNode(idAttr, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM Level 4
        getElementsByTagName(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByTagNameNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByClassName(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        isEqualNode(node) {
          var i, j, ref;
          if (!super.isEqualNode(node)) {
            return false;
          }
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.attribs.length !== this.attribs.length) {
            return false;
          }
          for (i = j = 0, ref = this.attribs.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            if (!this.attribs[i].isEqualNode(node.attribs[i])) {
              return false;
            }
          }
          return true;
        }
      }
      Object.defineProperty(XMLElement2.prototype, "tagName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLElement2.prototype, "prefix", {
        get: function() {
          return "";
        }
      });
      Object.defineProperty(XMLElement2.prototype, "localName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLElement2.prototype, "id", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "className", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "classList", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLElement2.prototype, "attributes", {
        get: function() {
          if (!this.attributeMap || !this.attributeMap.nodes) {
            this.attributeMap = new XMLNamedNodeMap2(this.attribs);
          }
          return this.attributeMap;
        }
      });
      return XMLElement2;
    }).call(this);
  }).call(XMLElement);
  return XMLElement$1.exports;
}
var XMLCData$1 = { exports: {} };
var XMLCharacterData$1 = { exports: {} };
var XMLCharacterData = XMLCharacterData$1.exports;
var hasRequiredXMLCharacterData;
function requireXMLCharacterData() {
  if (hasRequiredXMLCharacterData) return XMLCharacterData$1.exports;
  hasRequiredXMLCharacterData = 1;
  (function() {
    var XMLNode2;
    XMLNode2 = requireXMLNode();
    XMLCharacterData$1.exports = (function() {
      class XMLCharacterData2 extends XMLNode2 {
        // Initializes a new instance of `XMLCharacterData`
        constructor(parent) {
          super(parent);
          this.value = "";
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // DOM level 1 functions to be implemented later
        substringData(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        appendData(arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        insertData(offset, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        deleteData(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        replaceData(offset, count, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        isEqualNode(node) {
          if (!super.isEqualNode(node)) {
            return false;
          }
          if (node.data !== this.data) {
            return false;
          }
          return true;
        }
      }
      Object.defineProperty(XMLCharacterData2.prototype, "data", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      Object.defineProperty(XMLCharacterData2.prototype, "length", {
        get: function() {
          return this.value.length;
        }
      });
      Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
        get: function() {
          return this.value;
        },
        set: function(value) {
          return this.value = value || "";
        }
      });
      return XMLCharacterData2;
    }).call(this);
  }).call(XMLCharacterData);
  return XMLCharacterData$1.exports;
}
var XMLCData = XMLCData$1.exports;
var hasRequiredXMLCData;
function requireXMLCData() {
  if (hasRequiredXMLCData) return XMLCData$1.exports;
  hasRequiredXMLCData = 1;
  (function() {
    var NodeType2, XMLCharacterData2;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLCData$1.exports = class XMLCData extends XMLCharacterData2 {
      // Initializes a new instance of `XMLCData`
      // `text` CDATA text
      constructor(parent, text) {
        super(parent);
        if (text == null) {
          throw new Error("Missing CDATA text. " + this.debugInfo());
        }
        this.name = "#cdata-section";
        this.type = NodeType2.CData;
        this.value = this.stringify.cdata(text);
      }
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLCData);
  return XMLCData$1.exports;
}
var XMLComment$1 = { exports: {} };
var XMLComment = XMLComment$1.exports;
var hasRequiredXMLComment;
function requireXMLComment() {
  if (hasRequiredXMLComment) return XMLComment$1.exports;
  hasRequiredXMLComment = 1;
  (function() {
    var NodeType2, XMLCharacterData2;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLComment$1.exports = class XMLComment extends XMLCharacterData2 {
      // Initializes a new instance of `XMLComment`
      // `text` comment text
      constructor(parent, text) {
        super(parent);
        if (text == null) {
          throw new Error("Missing comment text. " + this.debugInfo());
        }
        this.name = "#comment";
        this.type = NodeType2.Comment;
        this.value = this.stringify.comment(text);
      }
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.comment(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLComment);
  return XMLComment$1.exports;
}
var XMLDeclaration$1 = { exports: {} };
var XMLDeclaration = XMLDeclaration$1.exports;
var hasRequiredXMLDeclaration;
function requireXMLDeclaration() {
  if (hasRequiredXMLDeclaration) return XMLDeclaration$1.exports;
  hasRequiredXMLDeclaration = 1;
  (function() {
    var NodeType2, XMLNode2, isObject;
    ({ isObject } = requireUtility());
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDeclaration$1.exports = class XMLDeclaration extends XMLNode2 {
      // Initializes a new instance of `XMLDeclaration`
      // `parent` the document object
      // `version` A version number string, e.g. 1.0
      // `encoding` Encoding declaration, e.g. UTF-8
      // `standalone` standalone document declaration: true or false
      constructor(parent, version, encoding, standalone) {
        super(parent);
        if (isObject(version)) {
          ({ version, encoding, standalone } = version);
        }
        if (!version) {
          version = "1.0";
        }
        this.type = NodeType2.Declaration;
        this.version = this.stringify.xmlVersion(version);
        if (encoding != null) {
          this.encoding = this.stringify.xmlEncoding(encoding);
        }
        if (standalone != null) {
          this.standalone = this.stringify.xmlStandalone(standalone);
        }
      }
      // Converts to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLDeclaration);
  return XMLDeclaration$1.exports;
}
var XMLDocType$1 = { exports: {} };
var XMLDTDAttList$1 = { exports: {} };
var XMLDTDAttList = XMLDTDAttList$1.exports;
var hasRequiredXMLDTDAttList;
function requireXMLDTDAttList() {
  if (hasRequiredXMLDTDAttList) return XMLDTDAttList$1.exports;
  hasRequiredXMLDTDAttList = 1;
  (function() {
    var NodeType2, XMLNode2;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDAttList$1.exports = class XMLDTDAttList extends XMLNode2 {
      // Initializes a new instance of `XMLDTDAttList`
      // `parent` the parent `XMLDocType` element
      // `elementName` the name of the element containing this attribute
      // `attributeName` attribute name
      // `attributeType` type of the attribute
      // `defaultValueType` default value type (either #REQUIRED, #IMPLIED,
      //                    #FIXED or #DEFAULT)
      // `defaultValue` default value of the attribute
      //                (only used for #FIXED or #DEFAULT)
      constructor(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        super(parent);
        if (elementName == null) {
          throw new Error("Missing DTD element name. " + this.debugInfo());
        }
        if (attributeName == null) {
          throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
        }
        if (!attributeType) {
          throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
        }
        if (!defaultValueType) {
          throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
        }
        if (defaultValueType.indexOf("#") !== 0) {
          defaultValueType = "#" + defaultValueType;
        }
        if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
          throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
        }
        if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
          throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
        }
        this.elementName = this.stringify.name(elementName);
        this.type = NodeType2.AttributeDeclaration;
        this.attributeName = this.stringify.name(attributeName);
        this.attributeType = this.stringify.dtdAttType(attributeType);
        if (defaultValue) {
          this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
        }
        this.defaultValueType = defaultValueType;
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLDTDAttList);
  return XMLDTDAttList$1.exports;
}
var XMLDTDEntity$1 = { exports: {} };
var XMLDTDEntity = XMLDTDEntity$1.exports;
var hasRequiredXMLDTDEntity;
function requireXMLDTDEntity() {
  if (hasRequiredXMLDTDEntity) return XMLDTDEntity$1.exports;
  hasRequiredXMLDTDEntity = 1;
  (function() {
    var NodeType2, XMLNode2, isObject;
    ({ isObject } = requireUtility());
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDEntity$1.exports = (function() {
      class XMLDTDEntity2 extends XMLNode2 {
        // Initializes a new instance of `XMLDTDEntity`
        // `parent` the parent `XMLDocType` element
        // `pe` whether this is a parameter entity or a general entity
        //      defaults to `false` (general entity)
        // `name` the name of the entity
        // `value` internal entity value or an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        // `value.nData` notation declaration
        constructor(parent, pe, name, value) {
          super(parent);
          if (name == null) {
            throw new Error("Missing DTD entity name. " + this.debugInfo(name));
          }
          if (value == null) {
            throw new Error("Missing DTD entity value. " + this.debugInfo(name));
          }
          this.pe = !!pe;
          this.name = this.stringify.name(name);
          this.type = NodeType2.EntityDeclaration;
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
            this.internal = true;
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
            }
            this.internal = false;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
            }
          }
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
        }
      }
      Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
        get: function() {
          return this.nData || null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
        get: function() {
          return null;
        }
      });
      return XMLDTDEntity2;
    }).call(this);
  }).call(XMLDTDEntity);
  return XMLDTDEntity$1.exports;
}
var XMLDTDElement$1 = { exports: {} };
var XMLDTDElement = XMLDTDElement$1.exports;
var hasRequiredXMLDTDElement;
function requireXMLDTDElement() {
  if (hasRequiredXMLDTDElement) return XMLDTDElement$1.exports;
  hasRequiredXMLDTDElement = 1;
  (function() {
    var NodeType2, XMLNode2;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDElement$1.exports = class XMLDTDElement extends XMLNode2 {
      // Initializes a new instance of `XMLDTDElement`
      // `parent` the parent `XMLDocType` element
      // `name` element name
      // `value` element content (defaults to #PCDATA)
      constructor(parent, name, value) {
        super(parent);
        if (name == null) {
          throw new Error("Missing DTD element name. " + this.debugInfo());
        }
        if (!value) {
          value = "(#PCDATA)";
        }
        if (Array.isArray(value)) {
          value = "(" + value.join(",") + ")";
        }
        this.name = this.stringify.name(name);
        this.type = NodeType2.ElementDeclaration;
        this.value = this.stringify.dtdElementValue(value);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLDTDElement);
  return XMLDTDElement$1.exports;
}
var XMLDTDNotation$1 = { exports: {} };
var XMLDTDNotation = XMLDTDNotation$1.exports;
var hasRequiredXMLDTDNotation;
function requireXMLDTDNotation() {
  if (hasRequiredXMLDTDNotation) return XMLDTDNotation$1.exports;
  hasRequiredXMLDTDNotation = 1;
  (function() {
    var NodeType2, XMLNode2;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDNotation$1.exports = (function() {
      class XMLDTDNotation2 extends XMLNode2 {
        // Initializes a new instance of `XMLDTDNotation`
        // `parent` the parent `XMLDocType` element
        // `name` the name of the notation
        // `value` an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        constructor(parent, name, value) {
          super(parent);
          if (name == null) {
            throw new Error("Missing DTD notation name. " + this.debugInfo(name));
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.type = NodeType2.NotationDeclaration;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
        }
      }
      Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      return XMLDTDNotation2;
    }).call(this);
  }).call(XMLDTDNotation);
  return XMLDTDNotation$1.exports;
}
var XMLDocType = XMLDocType$1.exports;
var hasRequiredXMLDocType;
function requireXMLDocType() {
  if (hasRequiredXMLDocType) return XMLDocType$1.exports;
  hasRequiredXMLDocType = 1;
  (function() {
    var NodeType2, XMLDTDAttList2, XMLDTDElement2, XMLDTDEntity2, XMLDTDNotation2, XMLNamedNodeMap2, XMLNode2, isObject;
    ({ isObject } = requireUtility());
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDTDAttList2 = requireXMLDTDAttList();
    XMLDTDEntity2 = requireXMLDTDEntity();
    XMLDTDElement2 = requireXMLDTDElement();
    XMLDTDNotation2 = requireXMLDTDNotation();
    XMLNamedNodeMap2 = requireXMLNamedNodeMap();
    XMLDocType$1.exports = (function() {
      class XMLDocType2 extends XMLNode2 {
        // Initializes a new instance of `XMLDocType`
        // `parent` the document object
        // `pubID` public identifier of the external subset
        // `sysID` system identifier of the external subset
        constructor(parent, pubID, sysID) {
          var child, i, len, ref;
          super(parent);
          this.type = NodeType2.DocType;
          if (parent.children) {
            ref = parent.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType2.Element) {
                this.name = child.name;
                break;
              }
            }
          }
          this.documentObject = parent;
          if (isObject(pubID)) {
            ({ pubID, sysID } = pubID);
          }
          if (sysID == null) {
            [sysID, pubID] = [pubID, sysID];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        // Creates an element type declaration
        // `name` element name
        // `value` element content (defaults to #PCDATA)
        element(name, value) {
          var child;
          child = new XMLDTDElement2(this, name, value);
          this.children.push(child);
          return this;
        }
        // Creates an attribute declaration
        // `elementName` the name of the element containing this attribute
        // `attributeName` attribute name
        // `attributeType` type of the attribute (defaults to CDATA)
        // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
        //                    #DEFAULT) (defaults to #IMPLIED)
        // `defaultValue` default value of the attribute
        //                (only used for #FIXED or #DEFAULT)
        attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList2(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        }
        // Creates a general entity declaration
        // `name` the name of the entity
        // `value` internal entity value or an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        // `value.nData` notation declaration
        entity(name, value) {
          var child;
          child = new XMLDTDEntity2(this, false, name, value);
          this.children.push(child);
          return this;
        }
        // Creates a parameter entity declaration
        // `name` the name of the entity
        // `value` internal entity value or an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        pEntity(name, value) {
          var child;
          child = new XMLDTDEntity2(this, true, name, value);
          this.children.push(child);
          return this;
        }
        // Creates a NOTATION declaration
        // `name` the name of the notation
        // `value` an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        notation(name, value) {
          var child;
          child = new XMLDTDNotation2(this, name, value);
          this.children.push(child);
          return this;
        }
        // Converts to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.docType(this, this.options.writer.filterOptions(options));
        }
        // Aliases
        ele(name, value) {
          return this.element(name, value);
        }
        att(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        }
        ent(name, value) {
          return this.entity(name, value);
        }
        pent(name, value) {
          return this.pEntity(name, value);
        }
        not(name, value) {
          return this.notation(name, value);
        }
        up() {
          return this.root() || this.documentObject;
        }
        isEqualNode(node) {
          if (!super.isEqualNode(node)) {
            return false;
          }
          if (node.name !== this.name) {
            return false;
          }
          if (node.publicId !== this.publicId) {
            return false;
          }
          if (node.systemId !== this.systemId) {
            return false;
          }
          return true;
        }
      }
      Object.defineProperty(XMLDocType2.prototype, "entities", {
        get: function() {
          var child, i, len, nodes, ref;
          nodes = {};
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.EntityDeclaration && !child.pe) {
              nodes[child.name] = child;
            }
          }
          return new XMLNamedNodeMap2(nodes);
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "notations", {
        get: function() {
          var child, i, len, nodes, ref;
          nodes = {};
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.NotationDeclaration) {
              nodes[child.name] = child;
            }
          }
          return new XMLNamedNodeMap2(nodes);
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "publicId", {
        get: function() {
          return this.pubID;
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "systemId", {
        get: function() {
          return this.sysID;
        }
      });
      Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      return XMLDocType2;
    }).call(this);
  }).call(XMLDocType);
  return XMLDocType$1.exports;
}
var XMLRaw$1 = { exports: {} };
var XMLRaw = XMLRaw$1.exports;
var hasRequiredXMLRaw;
function requireXMLRaw() {
  if (hasRequiredXMLRaw) return XMLRaw$1.exports;
  hasRequiredXMLRaw = 1;
  (function() {
    var NodeType2, XMLNode2;
    NodeType2 = requireNodeType();
    XMLNode2 = requireXMLNode();
    XMLRaw$1.exports = class XMLRaw extends XMLNode2 {
      // Initializes a new instance of `XMLRaw`
      // `text` raw text
      constructor(parent, text) {
        super(parent);
        if (text == null) {
          throw new Error("Missing raw text. " + this.debugInfo());
        }
        this.type = NodeType2.Raw;
        this.value = this.stringify.raw(text);
      }
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.raw(this, this.options.writer.filterOptions(options));
      }
    };
  }).call(XMLRaw);
  return XMLRaw$1.exports;
}
var XMLText$1 = { exports: {} };
var XMLText = XMLText$1.exports;
var hasRequiredXMLText;
function requireXMLText() {
  if (hasRequiredXMLText) return XMLText$1.exports;
  hasRequiredXMLText = 1;
  (function() {
    var NodeType2, XMLCharacterData2;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLText$1.exports = (function() {
      class XMLText2 extends XMLCharacterData2 {
        // Initializes a new instance of `XMLText`
        // `text` element text
        constructor(parent, text) {
          super(parent);
          if (text == null) {
            throw new Error("Missing element text. " + this.debugInfo());
          }
          this.name = "#text";
          this.type = NodeType2.Text;
          this.value = this.stringify.text(text);
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.text(this, this.options.writer.filterOptions(options));
        }
        // DOM level 1 functions to be implemented later
        splitText(offset) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM level 3 functions to be implemented later
        replaceWholeText(content) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      }
      Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
        get: function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      Object.defineProperty(XMLText2.prototype, "wholeText", {
        get: function() {
          var next, prev, str;
          str = "";
          prev = this.previousSibling;
          while (prev) {
            str = prev.data + str;
            prev = prev.previousSibling;
          }
          str += this.data;
          next = this.nextSibling;
          while (next) {
            str = str + next.data;
            next = next.nextSibling;
          }
          return str;
        }
      });
      return XMLText2;
    }).call(this);
  }).call(XMLText);
  return XMLText$1.exports;
}
var XMLProcessingInstruction$1 = { exports: {} };
var XMLProcessingInstruction = XMLProcessingInstruction$1.exports;
var hasRequiredXMLProcessingInstruction;
function requireXMLProcessingInstruction() {
  if (hasRequiredXMLProcessingInstruction) return XMLProcessingInstruction$1.exports;
  hasRequiredXMLProcessingInstruction = 1;
  (function() {
    var NodeType2, XMLCharacterData2;
    NodeType2 = requireNodeType();
    XMLCharacterData2 = requireXMLCharacterData();
    XMLProcessingInstruction$1.exports = class XMLProcessingInstruction extends XMLCharacterData2 {
      // Initializes a new instance of `XMLProcessingInstruction`
      // `parent` the parent node
      // `target` instruction target
      // `value` instruction value
      constructor(parent, target, value) {
        super(parent);
        if (target == null) {
          throw new Error("Missing instruction target. " + this.debugInfo());
        }
        this.type = NodeType2.ProcessingInstruction;
        this.target = this.stringify.insTarget(target);
        this.name = this.target;
        if (value) {
          this.value = this.stringify.insValue(value);
        }
      }
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
      }
      isEqualNode(node) {
        if (!super.isEqualNode(node)) {
          return false;
        }
        if (node.target !== this.target) {
          return false;
        }
        return true;
      }
    };
  }).call(XMLProcessingInstruction);
  return XMLProcessingInstruction$1.exports;
}
var XMLDummy$1 = { exports: {} };
var XMLDummy = XMLDummy$1.exports;
var hasRequiredXMLDummy;
function requireXMLDummy() {
  if (hasRequiredXMLDummy) return XMLDummy$1.exports;
  hasRequiredXMLDummy = 1;
  (function() {
    var NodeType2, XMLNode2;
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLDummy$1.exports = class XMLDummy extends XMLNode2 {
      // Initializes a new instance of `XMLDummy`
      // `XMLDummy` is a special node representing a node with 
      // a null value. Dummy nodes are created while recursively
      // building the XML tree. Simply skipping null values doesn't
      // work because that would break the recursive chain.
      constructor(parent) {
        super(parent);
        this.type = NodeType2.Dummy;
      }
      // Creates and returns a deep clone of `this`
      clone() {
        return Object.create(this);
      }
      // Converts the XML fragment to string
      // `options.pretty` pretty prints the result
      // `options.indent` indentation for pretty print
      // `options.offset` how many indentations to add to every line for pretty print
      // `options.newline` newline sequence for pretty print
      toString(options) {
        return "";
      }
    };
  }).call(XMLDummy);
  return XMLDummy$1.exports;
}
var XMLNodeList$1 = { exports: {} };
var XMLNodeList = XMLNodeList$1.exports;
var hasRequiredXMLNodeList;
function requireXMLNodeList() {
  if (hasRequiredXMLNodeList) return XMLNodeList$1.exports;
  hasRequiredXMLNodeList = 1;
  (function() {
    XMLNodeList$1.exports = (function() {
      class XMLNodeList2 {
        // Initializes a new instance of `XMLNodeList`
        // This is just a wrapper around an ordinary
        // JS array.
        // `nodes` the array containing nodes.
        constructor(nodes) {
          this.nodes = nodes;
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return this.nodes = null;
        }
        // DOM Level 1
        item(index) {
          return this.nodes[index] || null;
        }
      }
      Object.defineProperty(XMLNodeList2.prototype, "length", {
        get: function() {
          return this.nodes.length || 0;
        }
      });
      return XMLNodeList2;
    }).call(this);
  }).call(XMLNodeList);
  return XMLNodeList$1.exports;
}
var DocumentPosition$1 = { exports: {} };
var DocumentPosition = DocumentPosition$1.exports;
var hasRequiredDocumentPosition;
function requireDocumentPosition() {
  if (hasRequiredDocumentPosition) return DocumentPosition$1.exports;
  hasRequiredDocumentPosition = 1;
  (function() {
    DocumentPosition$1.exports = {
      Disconnected: 1,
      Preceding: 2,
      Following: 4,
      Contains: 8,
      ContainedBy: 16,
      ImplementationSpecific: 32
    };
  }).call(DocumentPosition);
  return DocumentPosition$1.exports;
}
var XMLNode = XMLNode$1.exports;
var hasRequiredXMLNode;
function requireXMLNode() {
  if (hasRequiredXMLNode) return XMLNode$1.exports;
  hasRequiredXMLNode = 1;
  (function() {
    var DocumentPosition2, NodeType2, XMLCData2, XMLComment2, XMLDeclaration2, XMLDocType2, XMLDummy2, XMLElement2, XMLNodeList2, XMLProcessingInstruction2, XMLRaw2, XMLText2, getValue, isEmpty, isFunction, isObject, hasProp = {}.hasOwnProperty, splice = [].splice;
    ({ isObject, isFunction, isEmpty, getValue } = requireUtility());
    XMLElement2 = null;
    XMLCData2 = null;
    XMLComment2 = null;
    XMLDeclaration2 = null;
    XMLDocType2 = null;
    XMLRaw2 = null;
    XMLText2 = null;
    XMLProcessingInstruction2 = null;
    XMLDummy2 = null;
    NodeType2 = null;
    XMLNodeList2 = null;
    DocumentPosition2 = null;
    XMLNode$1.exports = (function() {
      class XMLNode2 {
        // Initializes a new instance of `XMLNode`
        // `parent` the parent node
        constructor(parent1) {
          this.parent = parent1;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.value = null;
          this.children = [];
          this.baseURI = null;
          if (!XMLElement2) {
            XMLElement2 = requireXMLElement();
            XMLCData2 = requireXMLCData();
            XMLComment2 = requireXMLComment();
            XMLDeclaration2 = requireXMLDeclaration();
            XMLDocType2 = requireXMLDocType();
            XMLRaw2 = requireXMLRaw();
            XMLText2 = requireXMLText();
            XMLProcessingInstruction2 = requireXMLProcessingInstruction();
            XMLDummy2 = requireXMLDummy();
            NodeType2 = requireNodeType();
            XMLNodeList2 = requireXMLNodeList();
            requireXMLNamedNodeMap();
            DocumentPosition2 = requireDocumentPosition();
          }
        }
        // Sets the parent node of this node and its children recursively
        // `parent` the parent node
        setParent(parent) {
          var child, j, len, ref1, results;
          this.parent = parent;
          if (parent) {
            this.options = parent.options;
            this.stringify = parent.stringify;
          }
          ref1 = this.children;
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            results.push(child.setParent(this));
          }
          return results;
        }
        // Creates a child element node
        // `name` node name or an object describing the XML tree
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        element(name, attributes, text) {
          var childNode, item, j, k, key, lastChild, len, len1, val;
          lastChild = null;
          if (attributes === null && text == null) {
            [attributes, text] = [{}, null];
          }
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            [text, attributes] = [attributes, text];
          }
          if (name != null) {
            name = getValue(name);
          }
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              item = name[j];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key)) continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                lastChild = this.dummy();
              } else if (isObject(val) && isEmpty(val)) {
                lastChild = this.element(key);
              } else if (!this.options.keepNullNodes && val == null) {
                lastChild = this.dummy();
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k = 0, len1 = val.length; k < len1; k++) {
                  item = val[k];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                  lastChild = this.element(val);
                } else {
                  lastChild = this.element(key);
                  lastChild.element(val);
                }
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else if (!this.options.keepNullNodes && text === null) {
            lastChild = this.dummy();
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
          }
          return lastChild;
        }
        // Creates a child element node before the current node
        // `name` node name or an object describing the XML tree
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        insertBefore(name, attributes, text) {
          var child, i, newChild, refChild, removed;
          if (name != null ? name.type : void 0) {
            newChild = name;
            refChild = attributes;
            newChild.setParent(this);
            if (refChild) {
              i = children.indexOf(refChild);
              removed = children.splice(i);
              children.push(newChild);
              Array.prototype.push.apply(children, removed);
            } else {
              children.push(newChild);
            }
            return newChild;
          } else {
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
        }
        // Creates a child element node after the current node
        // `name` node name or an object describing the XML tree
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        insertAfter(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        }
        // Deletes a child element node
        remove() {
          var i;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element. " + this.debugInfo());
          }
          i = this.parent.children.indexOf(this);
          splice.apply(this.parent.children, [i, i - i + 1].concat([]));
          return this.parent;
        }
        // Creates a node
        // `name` name of the node
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        node(name, attributes, text) {
          var child;
          if (name != null) {
            name = getValue(name);
          }
          attributes || (attributes = {});
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            [text, attributes] = [attributes, text];
          }
          child = new XMLElement2(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        }
        // Creates a text node
        // `value` element text
        text(value) {
          var child;
          if (isObject(value)) {
            this.element(value);
          }
          child = new XMLText2(this, value);
          this.children.push(child);
          return this;
        }
        // Creates a CDATA node
        // `value` element text without CDATA delimiters
        cdata(value) {
          var child;
          child = new XMLCData2(this, value);
          this.children.push(child);
          return this;
        }
        // Creates a comment node
        // `value` comment text
        comment(value) {
          var child;
          child = new XMLComment2(this, value);
          this.children.push(child);
          return this;
        }
        // Creates a comment node before the current node
        // `value` comment text
        commentBefore(value) {
          var i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        }
        // Creates a comment node after the current node
        // `value` comment text
        commentAfter(value) {
          var i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        }
        // Adds unescaped raw text
        // `value` text
        raw(value) {
          var child;
          child = new XMLRaw2(this, value);
          this.children.push(child);
          return this;
        }
        // Adds a dummy node
        dummy() {
          var child;
          child = new XMLDummy2(this);
          return child;
        }
        // Adds a processing instruction
        // `target` instruction target
        // `value` instruction value
        instruction(target, value) {
          var insTarget, insValue, instruction, j, len;
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (j = 0, len = target.length; j < len; j++) {
              insTarget = target[j];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction2(this, target, value);
            this.children.push(instruction);
          }
          return this;
        }
        // Creates a processing instruction node before the current node
        // `target` instruction target
        // `value` instruction value
        instructionBefore(target, value) {
          var i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        }
        // Creates a processing instruction node after the current node
        // `target` instruction target
        // `value` instruction value
        instructionAfter(target, value) {
          var i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        }
        // Creates the xml declaration
        // `version` A version number string, e.g. 1.0
        // `encoding` Encoding declaration, e.g. UTF-8
        // `standalone` standalone document declaration: true or false
        declaration(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration2(doc, version, encoding, standalone);
          if (doc.children.length === 0) {
            doc.children.unshift(xmldec);
          } else if (doc.children[0].type === NodeType2.Declaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        }
        // Creates the document type declaration
        // `pubID` the public identifier of the external subset
        // `sysID` the system identifier of the external subset
        dtd(pubID, sysID) {
          var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
          doc = this.document();
          doctype = new XMLDocType2(doc, pubID, sysID);
          ref1 = doc.children;
          for (i = j = 0, len = ref1.length; j < len; i = ++j) {
            child = ref1[i];
            if (child.type === NodeType2.DocType) {
              doc.children[i] = doctype;
              return doctype;
            }
          }
          ref2 = doc.children;
          for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
            child = ref2[i];
            if (child.isRoot) {
              doc.children.splice(i, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        }
        // Gets the parent node
        up() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        }
        // Gets the root node
        root() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType2.Document) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        }
        // Gets the node representing the XML document
        document() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType2.Document) {
              return node;
            } else {
              node = node.parent;
            }
          }
        }
        // Ends the document and converts string
        end(options) {
          return this.document().end(options);
        }
        // Gets the previous node
        prev() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i < 1) {
            throw new Error("Already at the first node. " + this.debugInfo());
          }
          return this.parent.children[i - 1];
        }
        // Gets the next node
        next() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i === -1 || i === this.parent.children.length - 1) {
            throw new Error("Already at the last node. " + this.debugInfo());
          }
          return this.parent.children[i + 1];
        }
        // Imports cloned root from another XML document
        // `doc` the XML document to insert nodes from
        importDocument(doc) {
          var child, clonedRoot, j, len, ref1;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          if (this.type === NodeType2.Document) {
            clonedRoot.isRoot = true;
            clonedRoot.documentObject = this;
            this.rootObject = clonedRoot;
            if (this.children) {
              ref1 = this.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                if (child.type === NodeType2.DocType) {
                  child.name = clonedRoot.name;
                  break;
                }
              }
            }
          }
          return this;
        }
        // Returns debug string for this node
        debugInfo(name) {
          var ref1, ref2;
          name = name || this.name;
          if (name == null && !((ref1 = this.parent) != null ? ref1.name : void 0)) {
            return "";
          } else if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) {
            return "node: <" + name + ">";
          } else {
            return "node: <" + name + ">, parent: <" + this.parent.name + ">";
          }
        }
        // Aliases
        ele(name, attributes, text) {
          return this.element(name, attributes, text);
        }
        nod(name, attributes, text) {
          return this.node(name, attributes, text);
        }
        txt(value) {
          return this.text(value);
        }
        dat(value) {
          return this.cdata(value);
        }
        com(value) {
          return this.comment(value);
        }
        ins(target, value) {
          return this.instruction(target, value);
        }
        doc() {
          return this.document();
        }
        dec(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        }
        e(name, attributes, text) {
          return this.element(name, attributes, text);
        }
        n(name, attributes, text) {
          return this.node(name, attributes, text);
        }
        t(value) {
          return this.text(value);
        }
        d(value) {
          return this.cdata(value);
        }
        c(value) {
          return this.comment(value);
        }
        r(value) {
          return this.raw(value);
        }
        i(target, value) {
          return this.instruction(target, value);
        }
        u() {
          return this.up();
        }
        // can be deprecated in a future release
        importXMLBuilder(doc) {
          return this.importDocument(doc);
        }
        // Adds or modifies an attribute.
        // `name` attribute name
        // `value` attribute value
        attribute(name, value) {
          throw new Error("attribute() applies to element nodes only.");
        }
        att(name, value) {
          return this.attribute(name, value);
        }
        a(name, value) {
          return this.attribute(name, value);
        }
        // Removes an attribute
        // `name` attribute name
        removeAttribute(name) {
          throw new Error("attribute() applies to element nodes only.");
        }
        // DOM level 1 functions to be implemented later
        replaceChild(newChild, oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        removeChild(oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        appendChild(newChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        hasChildNodes() {
          return this.children.length !== 0;
        }
        cloneNode(deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        normalize() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM level 2
        isSupported(feature, version) {
          return true;
        }
        hasAttributes() {
          return this.attribs.length !== 0;
        }
        // DOM level 3 functions to be implemented later
        compareDocumentPosition(other) {
          var ref, res;
          ref = this;
          if (ref === other) {
            return 0;
          } else if (this.document() !== other.document()) {
            res = DocumentPosition2.Disconnected | DocumentPosition2.ImplementationSpecific;
            if (Math.random() < 0.5) {
              res |= DocumentPosition2.Preceding;
            } else {
              res |= DocumentPosition2.Following;
            }
            return res;
          } else if (ref.isAncestor(other)) {
            return DocumentPosition2.Contains | DocumentPosition2.Preceding;
          } else if (ref.isDescendant(other)) {
            return DocumentPosition2.Contains | DocumentPosition2.Following;
          } else if (ref.isPreceding(other)) {
            return DocumentPosition2.Preceding;
          } else {
            return DocumentPosition2.Following;
          }
        }
        isSameNode(other) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        lookupPrefix(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        isDefaultNamespace(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        lookupNamespaceURI(prefix) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        isEqualNode(node) {
          var i, j, ref1;
          if (node.nodeType !== this.nodeType) {
            return false;
          }
          if (node.children.length !== this.children.length) {
            return false;
          }
          for (i = j = 0, ref1 = this.children.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
            if (!this.children[i].isEqualNode(node.children[i])) {
              return false;
            }
          }
          return true;
        }
        getFeature(feature, version) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        setUserData(key, data, handler) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getUserData(key) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // Returns true if other is an inclusive descendant of node,
        // and false otherwise.
        contains(other) {
          if (!other) {
            return false;
          }
          return other === this || this.isDescendant(other);
        }
        // An object A is called a descendant of an object B, if either A is 
        // a child of B or A is a child of an object C that is a descendant of B.
        isDescendant(node) {
          var child, isDescendantChild, j, len, ref1;
          ref1 = this.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            if (node === child) {
              return true;
            }
            isDescendantChild = child.isDescendant(node);
            if (isDescendantChild) {
              return true;
            }
          }
          return false;
        }
        // An object A is called an ancestor of an object B if and only if
        // B is a descendant of A.
        isAncestor(node) {
          return node.isDescendant(this);
        }
        // An object A is preceding an object B if A and B are in the 
        // same tree and A comes before B in tree order.
        isPreceding(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos < thisPos;
          }
        }
        // An object A is folllowing an object B if A and B are in the 
        // same tree and A comes after B in tree order.
        isFollowing(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos > thisPos;
          }
        }
        // Returns the preorder position of the given node in the tree, or -1
        // if the node is not in the tree.
        treePosition(node) {
          var found, pos;
          pos = 0;
          found = false;
          this.foreachTreeNode(this.document(), function(childNode) {
            pos++;
            if (!found && childNode === node) {
              return found = true;
            }
          });
          if (found) {
            return pos;
          } else {
            return -1;
          }
        }
        // Depth-first preorder traversal through the XML tree
        foreachTreeNode(node, func) {
          var child, j, len, ref1, res;
          node || (node = this.document());
          ref1 = node.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            if (res = func(child)) {
              return res;
            } else {
              res = this.foreachTreeNode(child, func);
              if (res) {
                return res;
              }
            }
          }
        }
      }
      Object.defineProperty(XMLNode2.prototype, "nodeName", {
        get: function() {
          return this.name;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nodeType", {
        get: function() {
          return this.type;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nodeValue", {
        get: function() {
          return this.value;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "parentNode", {
        get: function() {
          return this.parent;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "childNodes", {
        get: function() {
          if (!this.childNodeList || !this.childNodeList.nodes) {
            this.childNodeList = new XMLNodeList2(this.children);
          }
          return this.childNodeList;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "firstChild", {
        get: function() {
          return this.children[0] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "lastChild", {
        get: function() {
          return this.children[this.children.length - 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "previousSibling", {
        get: function() {
          var i;
          i = this.parent.children.indexOf(this);
          return this.parent.children[i - 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "nextSibling", {
        get: function() {
          var i;
          i = this.parent.children.indexOf(this);
          return this.parent.children[i + 1] || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
        get: function() {
          return this.document() || null;
        }
      });
      Object.defineProperty(XMLNode2.prototype, "textContent", {
        get: function() {
          var child, j, len, ref1, str;
          if (this.nodeType === NodeType2.Element || this.nodeType === NodeType2.DocumentFragment) {
            str = "";
            ref1 = this.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              if (child.textContent) {
                str += child.textContent;
              }
            }
            return str;
          } else {
            return null;
          }
        },
        set: function(value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      });
      return XMLNode2;
    }).call(this);
  }).call(XMLNode);
  return XMLNode$1.exports;
}
var XMLStringifier$1 = { exports: {} };
var XMLStringifier = XMLStringifier$1.exports;
var hasRequiredXMLStringifier;
function requireXMLStringifier() {
  if (hasRequiredXMLStringifier) return XMLStringifier$1.exports;
  hasRequiredXMLStringifier = 1;
  (function() {
    var hasProp = {}.hasOwnProperty;
    XMLStringifier$1.exports = (function() {
      class XMLStringifier2 {
        // Initializes a new instance of `XMLStringifier`
        // `options.version` The version number string of the XML spec to validate against, e.g. 1.0
        // `options.noDoubleEncoding` whether existing html entities are encoded: true or false
        // `options.stringify` a set of functions to use for converting values to strings
        // `options.noValidation` whether values will be validated and escaped or returned as is
        constructor(options) {
          var key, ref, value;
          this.assertLegalChar = this.assertLegalChar.bind(this);
          this.assertLegalName = this.assertLegalName.bind(this);
          options || (options = {});
          this.options = options;
          if (!this.options.version) {
            this.options.version = "1.0";
          }
          ref = options.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this[key] = value;
          }
        }
        // Defaults
        name(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalName("" + val || "");
        }
        text(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.textEscape("" + val || ""));
        }
        cdata(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        }
        comment(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        }
        raw(val) {
          if (this.options.noValidation) {
            return val;
          }
          return "" + val || "";
        }
        attValue(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.attEscape(val = "" + val || ""));
        }
        insTarget(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        insValue(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return this.assertLegalChar(val);
        }
        xmlVersion(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        }
        xmlEncoding(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return this.assertLegalChar(val);
        }
        xmlStandalone(val) {
          if (this.options.noValidation) {
            return val;
          }
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        }
        dtdPubID(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdSysID(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdElementValue(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdAttType(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdAttDefault(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdEntityValue(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        dtdNData(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        }
        assertLegalChar(str) {
          var regex, res;
          if (this.options.noValidation) {
            return str;
          }
          regex = "";
          if (this.options.version === "1.0") {
            regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
            }
          } else if (this.options.version === "1.1") {
            regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
            }
          }
          return str;
        }
        assertLegalName(str) {
          var regex;
          if (this.options.noValidation) {
            return str;
          }
          this.assertLegalChar(str);
          regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
          if (!str.match(regex)) {
            throw new Error("Invalid character in name");
          }
          return str;
        }
        // Escapes special characters in text
        // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping
        // `str` the string to escape
        textEscape(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        }
        // Escapes special characters in attribute values
        // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping
        // `str` the string to escape
        attEscape(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        }
      }
      XMLStringifier2.prototype.convertAttKey = "@";
      XMLStringifier2.prototype.convertPIKey = "?";
      XMLStringifier2.prototype.convertTextKey = "#text";
      XMLStringifier2.prototype.convertCDataKey = "#cdata";
      XMLStringifier2.prototype.convertCommentKey = "#comment";
      XMLStringifier2.prototype.convertRawKey = "#raw";
      return XMLStringifier2;
    }).call(this);
  }).call(XMLStringifier);
  return XMLStringifier$1.exports;
}
var XMLStringWriter$1 = { exports: {} };
var XMLWriterBase$1 = { exports: {} };
var WriterState$1 = { exports: {} };
var WriterState = WriterState$1.exports;
var hasRequiredWriterState;
function requireWriterState() {
  if (hasRequiredWriterState) return WriterState$1.exports;
  hasRequiredWriterState = 1;
  (function() {
    WriterState$1.exports = {
      None: 0,
      OpenTag: 1,
      InsideTag: 2,
      CloseTag: 3
    };
  }).call(WriterState);
  return WriterState$1.exports;
}
var XMLWriterBase = XMLWriterBase$1.exports;
var hasRequiredXMLWriterBase;
function requireXMLWriterBase() {
  if (hasRequiredXMLWriterBase) return XMLWriterBase$1.exports;
  hasRequiredXMLWriterBase = 1;
  (function() {
    var NodeType2, WriterState2, assign, hasProp = {}.hasOwnProperty;
    ({ assign } = requireUtility());
    NodeType2 = requireNodeType();
    requireXMLDeclaration();
    requireXMLDocType();
    requireXMLCData();
    requireXMLComment();
    requireXMLElement();
    requireXMLRaw();
    requireXMLText();
    requireXMLProcessingInstruction();
    requireXMLDummy();
    requireXMLDTDAttList();
    requireXMLDTDElement();
    requireXMLDTDEntity();
    requireXMLDTDNotation();
    WriterState2 = requireWriterState();
    XMLWriterBase$1.exports = class XMLWriterBase {
      // Initializes a new instance of `XMLWriterBase`
      // `options.pretty` pretty prints the result
      // `options.indent` indentation string
      // `options.newline` newline sequence
      // `options.offset` a fixed number of indentations to add to every line
      // `options.width` maximum column width
      // `options.allowEmpty` do not self close empty element tags
      // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
      // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
      constructor(options) {
        var key, ref, value;
        options || (options = {});
        this.options = options;
        ref = options.writer || {};
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          value = ref[key];
          this["_" + key] = this[key];
          this[key] = value;
        }
      }
      // Filters writer options and provides defaults
      // `options` writer options
      filterOptions(options) {
        var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
        options || (options = {});
        options = assign({}, this.options, options);
        filteredOptions = {
          writer: this
        };
        filteredOptions.pretty = options.pretty || false;
        filteredOptions.allowEmpty = options.allowEmpty || false;
        filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
        filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
        filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
        filteredOptions.width = (ref3 = options.width) != null ? ref3 : 0;
        filteredOptions.dontPrettyTextNodes = (ref4 = (ref5 = options.dontPrettyTextNodes) != null ? ref5 : options.dontprettytextnodes) != null ? ref4 : 0;
        filteredOptions.spaceBeforeSlash = (ref6 = (ref7 = options.spaceBeforeSlash) != null ? ref7 : options.spacebeforeslash) != null ? ref6 : "";
        if (filteredOptions.spaceBeforeSlash === true) {
          filteredOptions.spaceBeforeSlash = " ";
        }
        filteredOptions.suppressPrettyCount = 0;
        filteredOptions.user = {};
        filteredOptions.state = WriterState2.None;
        return filteredOptions;
      }
      // Returns the indentation string for the current level
      // `node` current node
      // `options` writer options
      // `level` current indentation level
      indent(node, options, level) {
        var indentLevel;
        if (!options.pretty || options.suppressPrettyCount) {
          return "";
        } else if (options.pretty) {
          indentLevel = (level || 0) + options.offset + 1;
          if (indentLevel > 0) {
            return new Array(indentLevel).join(options.indent);
          }
        }
        return "";
      }
      // Returns the newline string
      // `node` current node
      // `options` writer options
      // `level` current indentation level
      endline(node, options, level) {
        if (!options.pretty || options.suppressPrettyCount) {
          return "";
        } else {
          return options.newline;
        }
      }
      attribute(att, options, level) {
        var r;
        this.openAttribute(att, options, level);
        if (options.pretty && options.width > 0) {
          r = att.name + '="' + att.value + '"';
        } else {
          r = " " + att.name + '="' + att.value + '"';
        }
        this.closeAttribute(att, options, level);
        return r;
      }
      cdata(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<![CDATA[";
        options.state = WriterState2.InsideTag;
        r += node.value;
        options.state = WriterState2.CloseTag;
        r += "]]>" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      comment(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<!-- ";
        options.state = WriterState2.InsideTag;
        r += node.value;
        options.state = WriterState2.CloseTag;
        r += " -->" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      declaration(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<?xml";
        options.state = WriterState2.InsideTag;
        r += ' version="' + node.version + '"';
        if (node.encoding != null) {
          r += ' encoding="' + node.encoding + '"';
        }
        if (node.standalone != null) {
          r += ' standalone="' + node.standalone + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + "?>";
        r += this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      docType(node, options, level) {
        var child, i, len1, r, ref;
        level || (level = 0);
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level);
        r += "<!DOCTYPE " + node.root().name;
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.children.length > 0) {
          r += " [";
          r += this.endline(node, options, level);
          options.state = WriterState2.InsideTag;
          ref = node.children;
          for (i = 0, len1 = ref.length; i < len1; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          r += "]";
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">";
        r += this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      element(node, options, level) {
        var att, attLen, child, childNodeCount, firstChildNode, i, j, len, len1, len2, name, prettySuppressed, r, ratt, ref, ref1, ref2, ref3, rline;
        level || (level = 0);
        prettySuppressed = false;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<" + node.name;
        if (options.pretty && options.width > 0) {
          len = r.length;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            ratt = this.attribute(att, options, level);
            attLen = ratt.length;
            if (len + attLen > options.width) {
              rline = this.indent(node, options, level + 1) + ratt;
              r += this.endline(node, options, level) + rline;
              len = rline.length;
            } else {
              rline = " " + ratt;
              r += rline;
              len += rline.length;
            }
          }
        } else {
          ref1 = node.attribs;
          for (name in ref1) {
            if (!hasProp.call(ref1, name)) continue;
            att = ref1[name];
            r += this.attribute(att, options, level);
          }
        }
        childNodeCount = node.children.length;
        firstChildNode = childNodeCount === 0 ? null : node.children[0];
        if (childNodeCount === 0 || node.children.every(function(e) {
          return (e.type === NodeType2.Text || e.type === NodeType2.Raw) && e.value === "";
        })) {
          if (options.allowEmpty) {
            r += ">";
            options.state = WriterState2.CloseTag;
            r += "</" + node.name + ">" + this.endline(node, options, level);
          } else {
            options.state = WriterState2.CloseTag;
            r += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
          }
        } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType2.Text || firstChildNode.type === NodeType2.Raw) && firstChildNode.value != null) {
          r += ">";
          options.state = WriterState2.InsideTag;
          options.suppressPrettyCount++;
          prettySuppressed = true;
          r += this.writeChildNode(firstChildNode, options, level + 1);
          options.suppressPrettyCount--;
          prettySuppressed = false;
          options.state = WriterState2.CloseTag;
          r += "</" + node.name + ">" + this.endline(node, options, level);
        } else {
          if (options.dontPrettyTextNodes) {
            ref2 = node.children;
            for (i = 0, len1 = ref2.length; i < len1; i++) {
              child = ref2[i];
              if ((child.type === NodeType2.Text || child.type === NodeType2.Raw) && child.value != null) {
                options.suppressPrettyCount++;
                prettySuppressed = true;
                break;
              }
            }
          }
          r += ">" + this.endline(node, options, level);
          options.state = WriterState2.InsideTag;
          ref3 = node.children;
          for (j = 0, len2 = ref3.length; j < len2; j++) {
            child = ref3[j];
            r += this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          r += this.indent(node, options, level) + "</" + node.name + ">";
          if (prettySuppressed) {
            options.suppressPrettyCount--;
          }
          r += this.endline(node, options, level);
          options.state = WriterState2.None;
        }
        this.closeNode(node, options, level);
        return r;
      }
      writeChildNode(node, options, level) {
        switch (node.type) {
          case NodeType2.CData:
            return this.cdata(node, options, level);
          case NodeType2.Comment:
            return this.comment(node, options, level);
          case NodeType2.Element:
            return this.element(node, options, level);
          case NodeType2.Raw:
            return this.raw(node, options, level);
          case NodeType2.Text:
            return this.text(node, options, level);
          case NodeType2.ProcessingInstruction:
            return this.processingInstruction(node, options, level);
          case NodeType2.Dummy:
            return "";
          case NodeType2.Declaration:
            return this.declaration(node, options, level);
          case NodeType2.DocType:
            return this.docType(node, options, level);
          case NodeType2.AttributeDeclaration:
            return this.dtdAttList(node, options, level);
          case NodeType2.ElementDeclaration:
            return this.dtdElement(node, options, level);
          case NodeType2.EntityDeclaration:
            return this.dtdEntity(node, options, level);
          case NodeType2.NotationDeclaration:
            return this.dtdNotation(node, options, level);
          default:
            throw new Error("Unknown XML node type: " + node.constructor.name);
        }
      }
      processingInstruction(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<?";
        options.state = WriterState2.InsideTag;
        r += node.target;
        if (node.value) {
          r += " " + node.value;
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + "?>";
        r += this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      raw(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level);
        options.state = WriterState2.InsideTag;
        r += node.value;
        options.state = WriterState2.CloseTag;
        r += this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      text(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level);
        options.state = WriterState2.InsideTag;
        r += node.value;
        options.state = WriterState2.CloseTag;
        r += this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      dtdAttList(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<!ATTLIST";
        options.state = WriterState2.InsideTag;
        r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
        if (node.defaultValueType !== "#DEFAULT") {
          r += " " + node.defaultValueType;
        }
        if (node.defaultValue) {
          r += ' "' + node.defaultValue + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      dtdElement(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<!ELEMENT";
        options.state = WriterState2.InsideTag;
        r += " " + node.name + " " + node.value;
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      dtdEntity(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<!ENTITY";
        options.state = WriterState2.InsideTag;
        if (node.pe) {
          r += " %";
        }
        r += " " + node.name;
        if (node.value) {
          r += ' "' + node.value + '"';
        } else {
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.nData) {
            r += " NDATA " + node.nData;
          }
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      dtdNotation(node, options, level) {
        var r;
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<!NOTATION";
        options.state = WriterState2.InsideTag;
        r += " " + node.name;
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.pubID) {
          r += ' PUBLIC "' + node.pubID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        options.state = WriterState2.CloseTag;
        r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
        options.state = WriterState2.None;
        this.closeNode(node, options, level);
        return r;
      }
      openNode(node, options, level) {
      }
      closeNode(node, options, level) {
      }
      openAttribute(att, options, level) {
      }
      closeAttribute(att, options, level) {
      }
    };
  }).call(XMLWriterBase);
  return XMLWriterBase$1.exports;
}
var XMLStringWriter = XMLStringWriter$1.exports;
var hasRequiredXMLStringWriter;
function requireXMLStringWriter() {
  if (hasRequiredXMLStringWriter) return XMLStringWriter$1.exports;
  hasRequiredXMLStringWriter = 1;
  (function() {
    var XMLWriterBase2;
    XMLWriterBase2 = requireXMLWriterBase();
    XMLStringWriter$1.exports = class XMLStringWriter extends XMLWriterBase2 {
      // Initializes a new instance of `XMLStringWriter`
      // `options.pretty` pretty prints the result
      // `options.indent` indentation string
      // `options.newline` newline sequence
      // `options.offset` a fixed number of indentations to add to every line
      // `options.allowEmpty` do not self close empty element tags
      // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
      // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
      constructor(options) {
        super(options);
      }
      document(doc, options) {
        var child, i, len, r, ref;
        options = this.filterOptions(options);
        r = "";
        ref = doc.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += this.writeChildNode(child, options, 0);
        }
        if (options.pretty && r.slice(-options.newline.length) === options.newline) {
          r = r.slice(0, -options.newline.length);
        }
        return r;
      }
    };
  }).call(XMLStringWriter);
  return XMLStringWriter$1.exports;
}
var XMLDocument = XMLDocument$1.exports;
var hasRequiredXMLDocument;
function requireXMLDocument() {
  if (hasRequiredXMLDocument) return XMLDocument$1.exports;
  hasRequiredXMLDocument = 1;
  (function() {
    var NodeType2, XMLDOMConfiguration2, XMLDOMImplementation2, XMLNode2, XMLStringWriter2, XMLStringifier2, isPlainObject;
    ({ isPlainObject } = requireUtility());
    XMLDOMImplementation2 = requireXMLDOMImplementation();
    XMLDOMConfiguration2 = requireXMLDOMConfiguration();
    XMLNode2 = requireXMLNode();
    NodeType2 = requireNodeType();
    XMLStringifier2 = requireXMLStringifier();
    XMLStringWriter2 = requireXMLStringWriter();
    XMLDocument$1.exports = (function() {
      class XMLDocument2 extends XMLNode2 {
        // Initializes a new instance of `XMLDocument`
        // `options.keepNullNodes` whether nodes with null values will be kept
        //     or ignored: true or false
        // `options.keepNullAttributes` whether attributes with null values will be
        //     kept or ignored: true or false
        // `options.ignoreDecorators` whether decorator strings will be ignored when
        //     converting JS objects: true or false
        // `options.separateArrayItems` whether array items are created as separate
        //     nodes when passed as an object value: true or false
        // `options.noDoubleEncoding` whether existing html entities are encoded:
        //     true or false
        // `options.stringify` a set of functions to use for converting values to
        //     strings
        // `options.writer` the default XML writer to use for converting nodes to
        //     string. If the default writer is not set, the built-in XMLStringWriter
        //     will be used instead.
        constructor(options) {
          super(null);
          this.name = "#document";
          this.type = NodeType2.Document;
          this.documentURI = null;
          this.domConfig = new XMLDOMConfiguration2();
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter2();
          }
          this.options = options;
          this.stringify = new XMLStringifier2(options);
        }
        // Ends the document and passes it to the given XML writer
        // `writer` is either an XML writer or a plain object to pass to the
        // constructor of the default XML writer. The default writer is assigned when
        // creating the XML document. Following flags are recognized by the
        // built-in XMLStringWriter:
        //   `writer.pretty` pretty prints the result
        //   `writer.indent` indentation for pretty print
        //   `writer.offset` how many indentations to add to every line for pretty print
        //   `writer.newline` newline sequence for pretty print
        end(writer) {
          var writerOptions;
          writerOptions = {};
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer;
          }
          return writer.document(this, writer.filterOptions(writerOptions));
        }
        // Converts the XML document to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.document(this, this.options.writer.filterOptions(options));
        }
        // DOM level 1 functions to be implemented later
        createElement(tagName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createDocumentFragment() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createTextNode(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createComment(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createCDATASection(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createProcessingInstruction(target, data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createAttribute(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createEntityReference(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByTagName(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM level 2 functions to be implemented later
        importNode(importedNode, deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createElementNS(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createAttributeNS(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementsByTagNameNS(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        getElementById(elementId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM level 3 functions to be implemented later
        adoptNode(source) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        normalizeDocument() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        renameNode(node, namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        // DOM level 4 functions to be implemented later
        getElementsByClassName(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createEvent(eventInterface) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createRange() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createNodeIterator(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
        createTreeWalker(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        }
      }
      Object.defineProperty(XMLDocument2.prototype, "implementation", {
        value: new XMLDOMImplementation2()
      });
      Object.defineProperty(XMLDocument2.prototype, "doctype", {
        get: function() {
          var child, i, len, ref;
          ref = this.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            if (child.type === NodeType2.DocType) {
              return child;
            }
          }
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "documentElement", {
        get: function() {
          return this.rootObject || null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
        get: function() {
          return false;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].encoding;
          } else {
            return null;
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].standalone === "yes";
          } else {
            return false;
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
        get: function() {
          if (this.children.length !== 0 && this.children[0].type === NodeType2.Declaration) {
            return this.children[0].version;
          } else {
            return "1.0";
          }
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "URL", {
        get: function() {
          return this.documentURI;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "origin", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "compatMode", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "characterSet", {
        get: function() {
          return null;
        }
      });
      Object.defineProperty(XMLDocument2.prototype, "contentType", {
        get: function() {
          return null;
        }
      });
      return XMLDocument2;
    }).call(this);
  }).call(XMLDocument);
  return XMLDocument$1.exports;
}
var XMLDocumentCB$1 = { exports: {} };
var XMLDocumentCB = XMLDocumentCB$1.exports;
var hasRequiredXMLDocumentCB;
function requireXMLDocumentCB() {
  if (hasRequiredXMLDocumentCB) return XMLDocumentCB$1.exports;
  hasRequiredXMLDocumentCB = 1;
  (function() {
    var NodeType2, WriterState2, XMLAttribute2, XMLCData2, XMLComment2, XMLDTDAttList2, XMLDTDElement2, XMLDTDEntity2, XMLDTDNotation2, XMLDeclaration2, XMLDocType2, XMLDocument2, XMLElement2, XMLProcessingInstruction2, XMLRaw2, XMLStringWriter2, XMLStringifier2, XMLText2, getValue, isFunction, isObject, isPlainObject, hasProp = {}.hasOwnProperty;
    ({ isObject, isFunction, isPlainObject, getValue } = requireUtility());
    NodeType2 = requireNodeType();
    XMLDocument2 = requireXMLDocument();
    XMLElement2 = requireXMLElement();
    XMLCData2 = requireXMLCData();
    XMLComment2 = requireXMLComment();
    XMLRaw2 = requireXMLRaw();
    XMLText2 = requireXMLText();
    XMLProcessingInstruction2 = requireXMLProcessingInstruction();
    XMLDeclaration2 = requireXMLDeclaration();
    XMLDocType2 = requireXMLDocType();
    XMLDTDAttList2 = requireXMLDTDAttList();
    XMLDTDEntity2 = requireXMLDTDEntity();
    XMLDTDElement2 = requireXMLDTDElement();
    XMLDTDNotation2 = requireXMLDTDNotation();
    XMLAttribute2 = requireXMLAttribute();
    XMLStringifier2 = requireXMLStringifier();
    XMLStringWriter2 = requireXMLStringWriter();
    WriterState2 = requireWriterState();
    XMLDocumentCB$1.exports = class XMLDocumentCB {
      // Initializes a new instance of `XMLDocumentCB`
      // `options.keepNullNodes` whether nodes with null values will be kept
      //     or ignored: true or false
      // `options.keepNullAttributes` whether attributes with null values will be
      //     kept or ignored: true or false
      // `options.ignoreDecorators` whether decorator strings will be ignored when
      //     converting JS objects: true or false
      // `options.separateArrayItems` whether array items are created as separate
      //     nodes when passed as an object value: true or false
      // `options.noDoubleEncoding` whether existing html entities are encoded:
      //     true or false
      // `options.stringify` a set of functions to use for converting values to
      //     strings
      // `options.writer` the default XML writer to use for converting nodes to
      //     string. If the default writer is not set, the built-in XMLStringWriter
      //     will be used instead.
      // `onData` the function to be called when a new chunk of XML is output. The
      //          string containing the XML chunk is passed to `onData` as its first
      //          argument, and the current indentation level as its second argument.
      // `onEnd`  the function to be called when the XML document is completed with
      //          `end`. `onEnd` does not receive any arguments.
      constructor(options, onData, onEnd) {
        var writerOptions;
        this.name = "?xml";
        this.type = NodeType2.Document;
        options || (options = {});
        writerOptions = {};
        if (!options.writer) {
          options.writer = new XMLStringWriter2();
        } else if (isPlainObject(options.writer)) {
          writerOptions = options.writer;
          options.writer = new XMLStringWriter2();
        }
        this.options = options;
        this.writer = options.writer;
        this.writerOptions = this.writer.filterOptions(writerOptions);
        this.stringify = new XMLStringifier2(options);
        this.onDataCallback = onData || function() {
        };
        this.onEndCallback = onEnd || function() {
        };
        this.currentNode = null;
        this.currentLevel = -1;
        this.openTags = {};
        this.documentStarted = false;
        this.documentCompleted = false;
        this.root = null;
      }
      // Creates a child element node from the given XMLNode
      // `node` the child node
      createChildNode(node) {
        var att, attName, attributes, child, i, len, ref, ref1;
        switch (node.type) {
          case NodeType2.CData:
            this.cdata(node.value);
            break;
          case NodeType2.Comment:
            this.comment(node.value);
            break;
          case NodeType2.Element:
            attributes = {};
            ref = node.attribs;
            for (attName in ref) {
              if (!hasProp.call(ref, attName)) continue;
              att = ref[attName];
              attributes[attName] = att.value;
            }
            this.node(node.name, attributes);
            break;
          case NodeType2.Dummy:
            this.dummy();
            break;
          case NodeType2.Raw:
            this.raw(node.value);
            break;
          case NodeType2.Text:
            this.text(node.value);
            break;
          case NodeType2.ProcessingInstruction:
            this.instruction(node.target, node.value);
            break;
          default:
            throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
        }
        ref1 = node.children;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          this.createChildNode(child);
          if (child.type === NodeType2.Element) {
            this.up();
          }
        }
        return this;
      }
      // Creates a dummy node
      dummy() {
        return this;
      }
      // Creates a node
      // `name` name of the node
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      node(name, attributes, text) {
        if (name == null) {
          throw new Error("Missing node name.");
        }
        if (this.root && this.currentLevel === -1) {
          throw new Error("Document can only have one root node. " + this.debugInfo(name));
        }
        this.openCurrent();
        name = getValue(name);
        if (attributes == null) {
          attributes = {};
        }
        attributes = getValue(attributes);
        if (!isObject(attributes)) {
          [text, attributes] = [attributes, text];
        }
        this.currentNode = new XMLElement2(this, name, attributes);
        this.currentNode.children = false;
        this.currentLevel++;
        this.openTags[this.currentLevel] = this.currentNode;
        if (text != null) {
          this.text(text);
        }
        return this;
      }
      // Creates a child element node or an element type declaration when called
      // inside the DTD
      // `name` name of the node
      // `attributes` an object containing name/value pairs of attributes
      // `text` element text
      element(name, attributes, text) {
        var child, i, len, oldValidationFlag, ref, root;
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          this.dtdElement(...arguments);
        } else {
          if (Array.isArray(name) || isObject(name) || isFunction(name)) {
            oldValidationFlag = this.options.noValidation;
            this.options.noValidation = true;
            root = new XMLDocument2(this.options).element("TEMP_ROOT");
            root.element(name);
            this.options.noValidation = oldValidationFlag;
            ref = root.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              this.createChildNode(child);
              if (child.type === NodeType2.Element) {
                this.up();
              }
            }
          } else {
            this.node(name, attributes, text);
          }
        }
        return this;
      }
      // Adds or modifies an attribute
      // `name` attribute name
      // `value` attribute value
      attribute(name, value) {
        var attName, attValue;
        if (!this.currentNode || this.currentNode.children) {
          throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
        }
        if (name != null) {
          name = getValue(name);
        }
        if (isObject(name)) {
          for (attName in name) {
            if (!hasProp.call(name, attName)) continue;
            attValue = name[attName];
            this.attribute(attName, attValue);
          }
        } else {
          if (isFunction(value)) {
            value = value.apply();
          }
          if (this.options.keepNullAttributes && value == null) {
            this.currentNode.attribs[name] = new XMLAttribute2(this, name, "");
          } else if (value != null) {
            this.currentNode.attribs[name] = new XMLAttribute2(this, name, value);
          }
        }
        return this;
      }
      // Creates a text node
      // `value` element text
      text(value) {
        var node;
        this.openCurrent();
        node = new XMLText2(this, value);
        this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates a CDATA node
      // `value` element text without CDATA delimiters
      cdata(value) {
        var node;
        this.openCurrent();
        node = new XMLCData2(this, value);
        this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates a comment node
      // `value` comment text
      comment(value) {
        var node;
        this.openCurrent();
        node = new XMLComment2(this, value);
        this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Adds unescaped raw text
      // `value` text
      raw(value) {
        var node;
        this.openCurrent();
        node = new XMLRaw2(this, value);
        this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Adds a processing instruction
      // `target` instruction target
      // `value` instruction value
      instruction(target, value) {
        var i, insTarget, insValue, len, node;
        this.openCurrent();
        if (target != null) {
          target = getValue(target);
        }
        if (value != null) {
          value = getValue(value);
        }
        if (Array.isArray(target)) {
          for (i = 0, len = target.length; i < len; i++) {
            insTarget = target[i];
            this.instruction(insTarget);
          }
        } else if (isObject(target)) {
          for (insTarget in target) {
            if (!hasProp.call(target, insTarget)) continue;
            insValue = target[insTarget];
            this.instruction(insTarget, insValue);
          }
        } else {
          if (isFunction(value)) {
            value = value.apply();
          }
          node = new XMLProcessingInstruction2(this, target, value);
          this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        }
        return this;
      }
      // Creates the xml declaration
      // `version` A version number string, e.g. 1.0
      // `encoding` Encoding declaration, e.g. UTF-8
      // `standalone` standalone document declaration: true or false
      declaration(version, encoding, standalone) {
        var node;
        this.openCurrent();
        if (this.documentStarted) {
          throw new Error("declaration() must be the first node.");
        }
        node = new XMLDeclaration2(this, version, encoding, standalone);
        this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates the document type declaration
      // `root`  the name of the root node
      // `pubID` the public identifier of the external subset
      // `sysID` the system identifier of the external subset
      doctype(root, pubID, sysID) {
        this.openCurrent();
        if (root == null) {
          throw new Error("Missing root node name.");
        }
        if (this.root) {
          throw new Error("dtd() must come before the root node.");
        }
        this.currentNode = new XMLDocType2(this, pubID, sysID);
        this.currentNode.rootNodeName = root;
        this.currentNode.children = false;
        this.currentLevel++;
        this.openTags[this.currentLevel] = this.currentNode;
        return this;
      }
      // Creates an element type declaration
      // `name` element name
      // `value` element content (defaults to #PCDATA)
      dtdElement(name, value) {
        var node;
        this.openCurrent();
        node = new XMLDTDElement2(this, name, value);
        this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates an attribute declaration
      // `elementName` the name of the element containing this attribute
      // `attributeName` attribute name
      // `attributeType` type of the attribute (defaults to CDATA)
      // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
      //                    #DEFAULT) (defaults to #IMPLIED)
      // `defaultValue` default value of the attribute
      //                (only used for #FIXED or #DEFAULT)
      attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
        var node;
        this.openCurrent();
        node = new XMLDTDAttList2(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
        this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates a general entity declaration
      // `name` the name of the entity
      // `value` internal entity value or an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      // `value.nData` notation declaration
      entity(name, value) {
        var node;
        this.openCurrent();
        node = new XMLDTDEntity2(this, false, name, value);
        this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates a parameter entity declaration
      // `name` the name of the entity
      // `value` internal entity value or an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      pEntity(name, value) {
        var node;
        this.openCurrent();
        node = new XMLDTDEntity2(this, true, name, value);
        this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Creates a NOTATION declaration
      // `name` the name of the notation
      // `value` an object with external entity details
      // `value.pubID` public identifier
      // `value.sysID` system identifier
      notation(name, value) {
        var node;
        this.openCurrent();
        node = new XMLDTDNotation2(this, name, value);
        this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
        return this;
      }
      // Gets the parent node
      up() {
        if (this.currentLevel < 0) {
          throw new Error("The document node has no parent.");
        }
        if (this.currentNode) {
          if (this.currentNode.children) {
            this.closeNode(this.currentNode);
          } else {
            this.openNode(this.currentNode);
          }
          this.currentNode = null;
        } else {
          this.closeNode(this.openTags[this.currentLevel]);
        }
        delete this.openTags[this.currentLevel];
        this.currentLevel--;
        return this;
      }
      // Ends the document
      end() {
        while (this.currentLevel >= 0) {
          this.up();
        }
        return this.onEnd();
      }
      // Opens the current parent node
      openCurrent() {
        if (this.currentNode) {
          this.currentNode.children = true;
          return this.openNode(this.currentNode);
        }
      }
      // Writes the opening tag of the current node or the entire node if it has
      // no child nodes
      openNode(node) {
        var att, chunk, name, ref;
        if (!node.isOpen) {
          if (!this.root && this.currentLevel === 0 && node.type === NodeType2.Element) {
            this.root = node;
          }
          chunk = "";
          if (node.type === NodeType2.Element) {
            this.writerOptions.state = WriterState2.OpenTag;
            chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
            ref = node.attribs;
            for (name in ref) {
              if (!hasProp.call(ref, name)) continue;
              att = ref[name];
              chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
            }
            chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
            this.writerOptions.state = WriterState2.InsideTag;
          } else {
            this.writerOptions.state = WriterState2.OpenTag;
            chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
            if (node.pubID && node.sysID) {
              chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              chunk += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.children) {
              chunk += " [";
              this.writerOptions.state = WriterState2.InsideTag;
            } else {
              this.writerOptions.state = WriterState2.CloseTag;
              chunk += ">";
            }
            chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
          }
          this.onData(chunk, this.currentLevel);
          return node.isOpen = true;
        }
      }
      // Writes the closing tag of the current node
      closeNode(node) {
        var chunk;
        if (!node.isClosed) {
          chunk = "";
          this.writerOptions.state = WriterState2.CloseTag;
          if (node.type === NodeType2.Element) {
            chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
          } else {
            chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
          }
          this.writerOptions.state = WriterState2.None;
          this.onData(chunk, this.currentLevel);
          return node.isClosed = true;
        }
      }
      // Called when a new chunk of XML is output
      // `chunk` a string containing the XML chunk
      // `level` current indentation level
      onData(chunk, level) {
        this.documentStarted = true;
        return this.onDataCallback(chunk, level + 1);
      }
      // Called when the XML document is completed
      onEnd() {
        this.documentCompleted = true;
        return this.onEndCallback();
      }
      // Returns debug string
      debugInfo(name) {
        if (name == null) {
          return "";
        } else {
          return "node: <" + name + ">";
        }
      }
      // Node aliases
      ele() {
        return this.element(...arguments);
      }
      nod(name, attributes, text) {
        return this.node(name, attributes, text);
      }
      txt(value) {
        return this.text(value);
      }
      dat(value) {
        return this.cdata(value);
      }
      com(value) {
        return this.comment(value);
      }
      ins(target, value) {
        return this.instruction(target, value);
      }
      dec(version, encoding, standalone) {
        return this.declaration(version, encoding, standalone);
      }
      dtd(root, pubID, sysID) {
        return this.doctype(root, pubID, sysID);
      }
      e(name, attributes, text) {
        return this.element(name, attributes, text);
      }
      n(name, attributes, text) {
        return this.node(name, attributes, text);
      }
      t(value) {
        return this.text(value);
      }
      d(value) {
        return this.cdata(value);
      }
      c(value) {
        return this.comment(value);
      }
      r(value) {
        return this.raw(value);
      }
      i(target, value) {
        return this.instruction(target, value);
      }
      // Attribute aliases
      att() {
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          return this.attList(...arguments);
        } else {
          return this.attribute(...arguments);
        }
      }
      a() {
        if (this.currentNode && this.currentNode.type === NodeType2.DocType) {
          return this.attList(...arguments);
        } else {
          return this.attribute(...arguments);
        }
      }
      // DTD aliases
      // att() and ele() are defined above
      ent(name, value) {
        return this.entity(name, value);
      }
      pent(name, value) {
        return this.pEntity(name, value);
      }
      not(name, value) {
        return this.notation(name, value);
      }
    };
  }).call(XMLDocumentCB);
  return XMLDocumentCB$1.exports;
}
var XMLStreamWriter$1 = { exports: {} };
var XMLStreamWriter = XMLStreamWriter$1.exports;
var hasRequiredXMLStreamWriter;
function requireXMLStreamWriter() {
  if (hasRequiredXMLStreamWriter) return XMLStreamWriter$1.exports;
  hasRequiredXMLStreamWriter = 1;
  (function() {
    var NodeType2, WriterState2, XMLWriterBase2, hasProp = {}.hasOwnProperty;
    NodeType2 = requireNodeType();
    XMLWriterBase2 = requireXMLWriterBase();
    WriterState2 = requireWriterState();
    XMLStreamWriter$1.exports = class XMLStreamWriter extends XMLWriterBase2 {
      // Initializes a new instance of `XMLStreamWriter`
      // `stream` output stream
      // `options.pretty` pretty prints the result
      // `options.indent` indentation string
      // `options.newline` newline sequence
      // `options.offset` a fixed number of indentations to add to every line
      // `options.allowEmpty` do not self close empty element tags
      // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
      // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
      constructor(stream, options) {
        super(options);
        this.stream = stream;
      }
      endline(node, options, level) {
        if (node.isLastRootNode && options.state === WriterState2.CloseTag) {
          return "";
        } else {
          return super.endline(node, options, level);
        }
      }
      document(doc, options) {
        var child, i, j, k, len1, len2, ref, ref1, results;
        ref = doc.children;
        for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
          child = ref[i];
          child.isLastRootNode = i === doc.children.length - 1;
        }
        options = this.filterOptions(options);
        ref1 = doc.children;
        results = [];
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          child = ref1[k];
          results.push(this.writeChildNode(child, options, 0));
        }
        return results;
      }
      cdata(node, options, level) {
        return this.stream.write(super.cdata(node, options, level));
      }
      comment(node, options, level) {
        return this.stream.write(super.comment(node, options, level));
      }
      declaration(node, options, level) {
        return this.stream.write(super.declaration(node, options, level));
      }
      docType(node, options, level) {
        var child, j, len1, ref;
        level || (level = 0);
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        this.stream.write(this.indent(node, options, level));
        this.stream.write("<!DOCTYPE " + node.root().name);
        if (node.pubID && node.sysID) {
          this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
        } else if (node.sysID) {
          this.stream.write(' SYSTEM "' + node.sysID + '"');
        }
        if (node.children.length > 0) {
          this.stream.write(" [");
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState2.InsideTag;
          ref = node.children;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          this.stream.write("]");
        }
        options.state = WriterState2.CloseTag;
        this.stream.write(options.spaceBeforeSlash + ">");
        this.stream.write(this.endline(node, options, level));
        options.state = WriterState2.None;
        return this.closeNode(node, options, level);
      }
      element(node, options, level) {
        var att, attLen, child, childNodeCount, firstChildNode, j, len, len1, name, r, ratt, ref, ref1, ref2, rline;
        level || (level = 0);
        this.openNode(node, options, level);
        options.state = WriterState2.OpenTag;
        r = this.indent(node, options, level) + "<" + node.name;
        if (options.pretty && options.width > 0) {
          len = r.length;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            ratt = this.attribute(att, options, level);
            attLen = ratt.length;
            if (len + attLen > options.width) {
              rline = this.indent(node, options, level + 1) + ratt;
              r += this.endline(node, options, level) + rline;
              len = rline.length;
            } else {
              rline = " " + ratt;
              r += rline;
              len += rline.length;
            }
          }
        } else {
          ref1 = node.attribs;
          for (name in ref1) {
            if (!hasProp.call(ref1, name)) continue;
            att = ref1[name];
            r += this.attribute(att, options, level);
          }
        }
        this.stream.write(r);
        childNodeCount = node.children.length;
        firstChildNode = childNodeCount === 0 ? null : node.children[0];
        if (childNodeCount === 0 || node.children.every(function(e) {
          return (e.type === NodeType2.Text || e.type === NodeType2.Raw) && e.value === "";
        })) {
          if (options.allowEmpty) {
            this.stream.write(">");
            options.state = WriterState2.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            options.state = WriterState2.CloseTag;
            this.stream.write(options.spaceBeforeSlash + "/>");
          }
        } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType2.Text || firstChildNode.type === NodeType2.Raw) && firstChildNode.value != null) {
          this.stream.write(">");
          options.state = WriterState2.InsideTag;
          options.suppressPrettyCount++;
          this.writeChildNode(firstChildNode, options, level + 1);
          options.suppressPrettyCount--;
          options.state = WriterState2.CloseTag;
          this.stream.write("</" + node.name + ">");
        } else {
          this.stream.write(">" + this.endline(node, options, level));
          options.state = WriterState2.InsideTag;
          ref2 = node.children;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            child = ref2[j];
            this.writeChildNode(child, options, level + 1);
          }
          options.state = WriterState2.CloseTag;
          this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
        }
        this.stream.write(this.endline(node, options, level));
        options.state = WriterState2.None;
        return this.closeNode(node, options, level);
      }
      processingInstruction(node, options, level) {
        return this.stream.write(super.processingInstruction(node, options, level));
      }
      raw(node, options, level) {
        return this.stream.write(super.raw(node, options, level));
      }
      text(node, options, level) {
        return this.stream.write(super.text(node, options, level));
      }
      dtdAttList(node, options, level) {
        return this.stream.write(super.dtdAttList(node, options, level));
      }
      dtdElement(node, options, level) {
        return this.stream.write(super.dtdElement(node, options, level));
      }
      dtdEntity(node, options, level) {
        return this.stream.write(super.dtdEntity(node, options, level));
      }
      dtdNotation(node, options, level) {
        return this.stream.write(super.dtdNotation(node, options, level));
      }
    };
  }).call(XMLStreamWriter);
  return XMLStreamWriter$1.exports;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  (function() {
    var NodeType2, WriterState2, XMLDOMImplementation2, XMLDocument2, XMLDocumentCB2, XMLStreamWriter2, XMLStringWriter2, assign, isFunction;
    ({ assign, isFunction } = requireUtility());
    XMLDOMImplementation2 = requireXMLDOMImplementation();
    XMLDocument2 = requireXMLDocument();
    XMLDocumentCB2 = requireXMLDocumentCB();
    XMLStringWriter2 = requireXMLStringWriter();
    XMLStreamWriter2 = requireXMLStreamWriter();
    NodeType2 = requireNodeType();
    WriterState2 = requireWriterState();
    lib.create = function(name, xmldec, doctype, options) {
      var doc, root;
      if (name == null) {
        throw new Error("Root element needs a name.");
      }
      options = assign({}, xmldec, doctype, options);
      doc = new XMLDocument2(options);
      root = doc.element(name);
      if (!options.headless) {
        doc.declaration(options);
        if (options.pubID != null || options.sysID != null) {
          doc.dtd(options);
        }
      }
      return root;
    };
    lib.begin = function(options, onData, onEnd) {
      if (isFunction(options)) {
        [onData, onEnd] = [options, onData];
        options = {};
      }
      if (onData) {
        return new XMLDocumentCB2(options, onData, onEnd);
      } else {
        return new XMLDocument2(options);
      }
    };
    lib.stringWriter = function(options) {
      return new XMLStringWriter2(options);
    };
    lib.streamWriter = function(stream, options) {
      return new XMLStreamWriter2(stream, options);
    };
    lib.implementation = new XMLDOMImplementation2();
    lib.nodeType = NodeType2;
    lib.writerState = WriterState2;
  }).call(lib);
  return lib;
}
export {
  requireLib as r
};
