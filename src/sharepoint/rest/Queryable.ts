"use strict";

import * as Util from "../../utils/util";
import { Dictionary } from "../../collections/collections";
import { HttpClient } from "../../net/HttpClient";

/**
 * Queryable Base Class
 *
 */
export class Queryable {

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | Queryable, path?: string) {

        this._query = new Dictionary<string>();

        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.
            if (baseUrl.lastIndexOf("/") > baseUrl.lastIndexOf("(")) {
                let index = baseUrl.lastIndexOf("/");
                this._parentUrl = baseUrl.slice(0, index);
                path = Util.combinePaths(baseUrl.slice(index + 1), path);
                this._url = Util.combinePaths(this._parentUrl, path);
            } else {
                let index = baseUrl.lastIndexOf("(");
                this._parentUrl = baseUrl.slice(0, index);
                this._url = Util.combinePaths(baseUrl, path);
            }
        } else {
            let q = baseUrl as Queryable;
            this._parentUrl = q._url;
            this._query.merge(q._query);
            this._url = Util.combinePaths(this._parentUrl, path);
        }
    }

    /**
     * Tracks the query parts of the url
     */
    public _query: Dictionary<string>;

    /**
     * Tracks the url as it is built
     */
    public _url: string;

    /**
     * Stores the parent url used to create this instance, for recursing back up the tree if needed
     */
    public _parentUrl: string;

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatonate to the url
     */
    public concat(pathPart: string) {
        this._url += pathPart;
    }

    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    public append(pathPart: string) {
        this._url = Util.combinePaths(this._url, pathPart);
    }

    /**
     * Gets the parent url used when creating this instance
     *
     */
    public get parentUrl(): string {
        return this._parentUrl;
    }

    /**
     * Provides access to the query builder for this url
     *
     */
    public get query(): Dictionary<string> {
        return this._query;
    }

    /**
     * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
     *
     */
    public toUrl(): string {
        if (!Util.isUrlAbsolute(this._url)) {
            if (typeof _spPageContextInfo !== "undefined") {
                if (_spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                    return Util.combinePaths(_spPageContextInfo.webAbsoluteUrl, this._url);
                } else if (_spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                    return Util.combinePaths(_spPageContextInfo.webServerRelativeUrl, this._url);
                }
            }
        }

        return this._url;
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {
        let url = this.toUrl();
        if (this._query.count() > 0) {
            url += "?";
            let keys = this._query.getKeys();
            url += keys.map((key, ix, arr) => `${key}=${this._query.get(key)}`).join("&");
        }
        return url;
    }

    /**
     * Executes the currently built request
     *
     */
    public get(parser: (r: Response) => Promise<any> = this.defaultParser): Promise<any> {
        let client = new HttpClient();
        return client.get(this.toUrlAndQuery()).then(function (response) {

            if (!response.ok) {
                throw "Error making GET request: " + response.statusText;
            }

            return parser(response);

        }).then(function (parsed) {
            return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
        });
    }

    public post(postOptions: any = {}, parser: (r: Response) => Promise<any> = this.defaultParser): Promise<any> {

        let client = new HttpClient();

        return client.post(this.toUrlAndQuery(), postOptions).then(function (response) {

            // 200 = OK (delete)
            // 201 = Created (create)
            // 204 = No Content (update)
            if (!response.ok) {
                throw "Error making POST request: " + response.statusText;
            }

            if ((response.headers.has("Content-Length") && parseFloat(response.headers.get("Content-Length")) === 0)
                || response.status === 204) {

                // in these cases the server has returned no content, so we create an empty object
                // this was done because the fetch browser methods throw exceptions with no content
                return new Promise<any>((resolve, reject) => { resolve({}); });
            }

            // pipe our parsed content
            return parser(response);
        });
    }

    /**
     * Default parser used to simply the parsing of standard SharePoint results
     *
     * @param r Response object from a successful fetch request
     */
    public defaultParser(r: Response): Promise<any> {
        return r.json().then(function (json) {
            if (json.hasOwnProperty("d")) {
                if (json.d.hasOwnProperty("results")) {
                    return json.d.results;
                }
                return json.d;
            } else if (json.hasOwnProperty("value")) {
                return json.value;
            }
            return json;
        });
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class QueryableCollection extends Queryable {

    public filter(filter: string): any {
        this._query.add("$filter", filter);
        return this;
    }

    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }
}


/**
 * Represents an instance that can be selected
 *
 */
export class QueryableInstance extends Queryable {

    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }
}
