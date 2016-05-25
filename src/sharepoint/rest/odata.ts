import { QueryableConstructor } from "./queryable";
import { Util } from "../../utils/util";

export interface ODataParser<T, U> {
    parse(r: Response): Promise<U>;
}

export class ODataDefaultParser implements ODataParser<any, any> {
    constructor(private parser: IJsonParser = new JsonParser()) { }
    public parse(r: Response): Promise<any> {
        return this.parser.parse(r);
    }
}

export function ODataValue<T>(): ODataParser<any, T> {
    return new ODataValueParserImpl<T>();
}

export function ODataEntity<T>(factory: QueryableConstructor<T>): ODataParser<T, T> {
    return new ODataEntityParserImpl(factory);
}

export function ODataEntityArray<T>(factory: QueryableConstructor<T>): ODataParser<T, T[]> {
    return new ODataEntityArrayParserImpl<T>(factory);
}

export class ODataValueParserImpl<T> implements ODataParser<any, T> {
    constructor(private parser: IJsonParser = new JsonParser()) { }
    public parse(r: Response): Promise<T> {
        return this.parser.parse(r).then(d => d as T);
    }
}

class ODataEntityParserImpl<T> implements ODataParser<T, T> {

    constructor(protected factory: QueryableConstructor<T>, private parser: IJsonParser = new JsonParser()) { }

    public parse(r: Response): Promise<T> {
        return this.parser.parse(r).then(d => {
            let o = new this.factory(d["odata.editLink"]);
            return Util.extend(o, d);
        });
    }
}

class ODataEntityArrayParserImpl<T> implements ODataParser<T, T[]> {

    constructor(protected factory: QueryableConstructor<T>, private parser: IJsonParser = new JsonParser()) { }

    public parse(r: Response): Promise<T[]> {
        return this.parser.parse(r).then((d: any[]) => {
            return d.map(v => {
                let o = new this.factory(v["odata.editLink"]);
                return Util.extend(o, v);
            });
        });
    }
}

export interface IJsonParser {
    parse(r: Response): Promise<any>;
}

class JsonParser implements IJsonParser {
    public parse(r: Response): Promise<any> {

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
