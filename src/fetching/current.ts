import { TFile } from 'obsidian';
import {
  Sections} from '../types/sections/sections';
import {
  MetaScryApi
} from "../types/fetching/scrier";
import { CurrentNoteMetaScryApi } from "../types/fetching/current";
import { CurrentNoteMetaEditApi } from "../types/editing/editor";
import {
  Cache, Frontmatter,
  Metadata,
  DataviewMatter
} from "../types/datas";
import { IsString } from '../utilities';
import { InternalStaticMetadataScrierPluginContainer } from '../static';
import { DefaultFrontmatterUpdateOptions } from '../constants';
import { CurrentMetaBindApi } from '../types/editing/bind';
import { CurrentMetadataInputBinder } from '../editing/bind';
import { FrontmatterUpdateSettings } from '../lib';

/**
 * Access to current metadata via localized versions of the calls in MetaScryApi
 * 
 * @internal
 */
export class CurrentNoteScrier implements CurrentNoteMetaScryApi {
  private _api: MetaScryApi;

  constructor(metaApi: MetaScryApi) {
    this._api = metaApi;
  }

  get Data(): Metadata  {
    return this._api.get() as Metadata;
  }

  get data(): Metadata {
    return this.Data;
  }

  get Note(): TFile {
    const specialCache = this._api.cache("_zpec:a|") as Cache;
    if (IsString(specialCache["CurrentPath"])) {
      const current = this._api.vault(
        specialCache["CurrentPath"]
      ) as TFile;
      
      if (!current) {
        throw "No Current File";
      }
      
      return current;
    }

    const current = app.workspace.getActiveFile();

    if (!current) {
      throw "No Current File";
    }
    
    return current;
  }

  get note(): TFile {
    return this.Note;
  }

  get Path(): string {
    const note: TFile = this.Note;
    let path = note.path;
    if (note.extension) {
      path = path.slice(0, 0 - (note.extension.length + 1));
    }

    return path;
  }

  get path(): string {
    return this.Path;
  }

  get PathEx(): string {
    return this.note.path;
  }

  get pathex(): string {
    return this.PathEx;
  }

  get Matter(): Frontmatter {
    return this._api.frontmatter() as Frontmatter;
  }

  get matter(): Frontmatter {
    return this.Matter;
  }

  get fm(): Frontmatter {
    return this.Matter;
  }

  get Fm(): Frontmatter {
    return this.Matter;
  }

  get Frontmatter(): Frontmatter {
    return this.Matter;
  }
  
  get frontmatter(): Frontmatter {
    return this.Matter;
  }

  get Cache(): Cache {
    return this._api.cache() as Cache;
  }

  get cache(): Cache {
    return this.Cache;
  }

  get Sections(): Sections {
    return this._api.sections() as Sections;
  }

  get sections(): Sections {
    return this.Sections;
  }

  get dv(): DataviewMatter {
    return this._api.dvMatter() as DataviewMatter;
  }

  get Dv(): DataviewMatter {
    return this.dv;
  }

  get edit(): CurrentNoteMetaEditApi {
    const api = this._api.edit;
    const currentFile = this.note;

    // Apply the current file as the file to update
    return {
      ...InternalStaticMetadataScrierPluginContainer.BaseMetadataEditApiMethods,
      get: (key, inline) =>
        api.getFieldFromTFile(key, currentFile, inline),
      exists: (key, inline) =>
        api.doesFieldExistInTFile(key, currentFile, inline),
      insert: async (key, value, inline) =>
        await api.insertFieldInTFile(key, value, currentFile, inline),
      update: async (key, value, inline) =>
        await api.updateFieldInTFile(key, value, currentFile, inline),
      upsert: async (key, value, inline) =>
        await api.updateOrInsertFieldInTFile(key, value, currentFile, inline),
      delete: async (key, inline) =>
        await api.deleteFieldInTFile(key, currentFile, inline),
      replace: async (value) =>
        await api.setAllFrontmatter(value, currentFile),
      clear: async () => {
        await api.setAllFrontmatter({}, currentFile);
      }
    }
  }

  get Edit(): CurrentNoteMetaEditApi {
    return this.edit;
  }

  patch(frontmatterData: any, propertyName?: string, options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions): any | object {
    return this._api.patch(this.path, frontmatterData, propertyName, options);
  }

  set(frontmatterData: any, options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions): any | object {
    return this._api.set(this.path, frontmatterData, options);
  }

  clear(frontmatterProperties?: string | Array<string> | object, options: FrontmatterUpdateSettings = DefaultFrontmatterUpdateOptions) {
    return this._api.clear(this.path, frontmatterProperties, options);
  }
  
  bind: CurrentMetaBindApi
    = CurrentMetadataInputBinder;
    //alias:
  inputField: CurrentMetaBindApi
    = CurrentMetadataInputBinder;
    //alias:
  Bind: CurrentMetaBindApi
    = CurrentMetadataInputBinder;
    //alias:
  InputField: CurrentMetaBindApi
    = CurrentMetadataInputBinder;
}