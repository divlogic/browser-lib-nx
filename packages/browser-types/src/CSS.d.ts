declare interface Highlight {
  /**
   * It is possible to create Range objects that overlap in a document.
   * When overlapping ranges are used by multiple different Highlight objects, and when those highlights are styled using ::highlight pseudo-elements, this may lead to conflicting styles.
   * If two text ranges overlap and are both highlighted using the CSS Custom Highlight API, and if they're both styled using the color CSS property, the browser needs to decide which color should be used for styling the text in the overlapping part.
   * By default, all highlights have the same priority and the browser chooses the most recently registered highlight to style the overlapping parts.
   * The priority property of the Highlight interface is a Number used to change this default behavior and determine which highlight's styles should be used to resolve style conflicts in overlapping parts.
   * Note that all the styles of a highlight are applied and the browser only needs to resolve conflicts when the same CSS properties are used by multiple overlapping highlights. The highlight style conflict resolution also does not depend on the order in which the ::highlight pseudo-elements rules appear in the source, or whether or not CSS properties are marked as !important.
   *
   */
  priority: number;
  /**
   * The value of size is a read-only integer representing how many entries the highlight object has.
   */
  size: number;
  /**
   * The type property of the Highlight interface is an enumerated String used to specify the meaning of the highlight. This allows assistive technologies, such as screen readers, to include this meaning when exposing the highlight to users.
  * 
  * By default, a highlight object will have its type set to highlight, but you can change it to spelling-error or grammar-error.
  * Value
  * 
  * The possible values of the type enumerated value are:
  * `highlight`
  * 
  *     This is the default highlight type. It does not have any specific meaning.
  * `spelling-error`
  * 
  *     Use this type when the highlight is used to emphasize misspelled content.
  * `grammar-error`
  * 
    Use this type when the highlight is used to emphasize content that is grammatically incorrect.

   */
  type: 'highlight' | 'spelling-error' | 'grammar-error';
  /**
   * The add() method of the Highlight interface adds a new Range object to a highlight, to be styled using the CSS Custom Highlight API.
   * @param range
   * @returns this
   */
  add(range: Range): this;

  /**
   * The clear() method of the Highlight interface removes all the Range objects from a Highlight object.
   */
  clear(): void;

  /**
   * The delete() method of the Highlight interface removes a specified Range object from a Highlight object.
   *
   * @param range - The Range object to remove from the `Highlight`.
   * @returns boolean - Returns true if range was already in Highlight; otherwise false.
   */
  delete(range: Range): boolean;

  /**
   * The entries() method of Map instances returns a new map iterator object that contains the [key, value] pairs for each element in this map in insertion order.
   */
  entries(): Iterable<Range>;

  /**
   * The forEach() method of the Highlight interface executes a provided function once for each Range object in the Highlight object, in insertion order.
   *
   *
   * `callback`
   *
   *     Function to execute for each Range object, taking three arguments:
   *
   *     `range`, `key`
   *
   *         The current Range object being processed in the Highlight. As there are no keys in Highlight, the range is passed for both arguments.
   *     highlight
   *
   *         The Highlight object which forEach() was called upon.
   *
   * `thisArg`
   *
   *     Value to use as this when executing callbackFn.
   *
   * @param callback
   */
  forEach(
    callback: (range: Range, key: Range, highlight: Highlight) => void,
    thisArg
  ): void;

  /**
   * The has() method of the Highlight interface returns a boolean indicating whether a Range object exists in a Highlight object or not.
   *
   * @param range - The Range object to test for presence in the Highlight object.
   * @returns boolean - Returns true if the specified range exists in the Highlight object; otherwise false.
   */
  has(range: Range): boolean;

  /**
   * The keys() method of the Highlight interface is an alias for the values() method.
   * @returns Iterable<Range> - A new iterator object containing each Range object in the given Highlight, in insertion order.
   */
  keys(): Iterable<Range>;

  /**
   * The values() method of the Highlight interface returns a new Iterator object that contains the values for each Range object in the Highlight object in insertion order.
   * @returns Iterable<Range> - A new iterator object containing each Range object in the given Highlight, in insertion order.
   */
  values(): Iterable<Range>;
}

/* eslint no-var: "off" */
declare var Highlight: {
  prototype: Highlight;

  /**
   *  The Highlight() constructor returns a newly created Highlight object which can hold a collection of Range objects to be styled using the CSS Custom Highlight API.
   *
   * @param range[] - One ore more initial Range objects to add in the new highlight.
   * @returns Highlight - A new Highlight object.
   */
  new (...range: Range[]);
};

interface HighlightRegistry {
  /**
   * The size property returns the number of `Highlight` objects in the `HighlightRegistry`.
   */
  readonly size: number;

  /**
   * The clear() method of the HighlightRegistry interface removes all the Highlight objects registered in the HighlightRegistry.
   * HighlightRegistry is a Map-like object, so this is similar to using Map.clear().
   * @returns void
   */
  clear(): void;

  /**
   * The delete() method of the HighlightRegistry interface removes a the named Highlight object from the HighlightRegistry.
   * HighlightRegistry is a Map-like object, so this is similar to using Map.delete().
   *
   * @param customHighlightName - The name, as a String, of the Highlight object to remove from the HighlightRegistry.
   * @returns boolean
   */
  delete(customHighlightName: string): boolean;

  /**
   * The entries() method of Map instances returns a new map iterator object that contains the [key, value] pairs for each element in this map in insertion order.
   */
  entries(): Iterable<[string, Highlight]>;

  /**
   * The forEach() method of the HighlightRegistry interface executes a provided function once for each Highlight object in the registry, in insertion order.
   *
   * @param callback
   * @param thisArg
   * @returns void
   */
  forEach(
    callback: (
      highlight: Highlight,
      name: string,
      registry: HighlightRegistry
    ) => void,
    thisArg?: unknown
  ): void;

  /**
   * The get() method of the HighlightRegistry interface returns the named Highlight object from the registry.
   * @param name - The name of the Highlight object to return from the registry. The name must be a String.
   * @returns Highlight | undefined - The Highlight object associated with the specified name, or undefined if the name can't be found in the HighlightRegistry.
   */
  get(name: string): Highlight | undefined;

  /**
   * The has() method of the HighlightRegistry interface returns a boolean indicating whether or not a Highlight object with the specified name exists in the registry.
   * @param name The name of the `Highlight` object to test for presence in the registry.
   * @returns boolean - Returns true if a highlight with the specified name exists in the registry; otherwise false.
   */
  has(name: string): boolean;

  /**
   * The keys() method of the HighlightRegistry interface returns a new Iterator object that contains the keys for each Highlight object in the HighlightRegistry object in insertion order.
   * An alias for HighlightRegistry.values().
   *
   * @returns Iterator<string> - A new iterator object containing the names of each Highlight object in the registry, in insertion order.
   */
  keys(): Iterable<string>;

  /**
   * The set() method of the HighlightRegistry interface adds or updates a Highlight object in the registry with the specified name.
   *
   * @param {string} name - The name of the Highlight object to add or update. The name must be a String.
   * @param {Highlight} highlight - The Highlight object to add or update. This must be a Highlight interface instance.
   * @returns {HighlightRegistry} HighlightRegistry
   */
  set(name: string, highlight: Highlight): HighlightRegistry;

  /**
   * The `values()` method of the `HighlightRegistry` interface returns a new Iterator object that contains the values for each `Highlight` object in the `HighlightRegistry` object in insertion order.
   * @returns Iterable<Highlight> - A new iterator object containing each Highlight object in the registry, in insertion order.
   */
  values(): Iterable<Highlight>;
}

declare namespace CSS {
  /**
   * The HighlightRegistry interface of the CSS Custom Highlight API is used to register Highlight objects to be styled using the API. It is accessed via CSS.highlights.
   *
   * A HighlightRegistry instance is a Map-like object, in which each key is the name string for a custom highlight, and the corresponding value is the associated Highlight object.
   */

  const highlights: HighlightRegistry;
}

CSS.highlights.get('foo');
