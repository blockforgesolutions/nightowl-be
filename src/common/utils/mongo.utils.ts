/**
 * Transforms MongoDB document by converting _id to id and removing __v
 * @param document The MongoDB document to transform
 * @returns Transformed document with id instead of _id and without __v, or null if document is null
 */
export function transformMongoDocument<T extends { _id: any; __v?: any }, R = T>(
  document: T | null
): (Omit<R, '_id' | '__v'> & { id: any }) | null {
  if (!document) {
    return null;
  }

  function transform(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(transform); 
    } else if (obj !== null && typeof obj === 'object') {
      const { _id, __v, ...rest } = obj;
  
      if (obj instanceof Date) {
        return obj.toISOString();
      }
  
      return {
        id: _id ? _id.toString() : obj.id,
        ...Object.fromEntries(
          Object.entries(rest).map(([key, value]) => [key, transform(value)])
        ),
      };
    }
    return obj;
  }

  // Explicitly type cast to handle the generic transformation
  return transform(document) as (Omit<R, '_id' | '__v'> & { id: any });
}

/**
 * Transforms an array of MongoDB documents by converting _id to id and removing __v
 * @param documents Array of MongoDB documents to transform
 * @returns Array of transformed documents with id instead of _id and without __v
 */
export function transformMongoArray<T extends { _id: any; __v?: any }, R = T>(
  documents: T[]
): (Omit<R, '_id' | '__v'> & { id: any })[] {
  return documents
    .map(doc => transformMongoDocument<T, R>(doc))
    .filter((doc): doc is Omit<R, '_id' | '__v'> & { id: any } => doc !== null);
}