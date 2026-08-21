import { supabase } from '../lib/supabase.js'
import { AppError } from '../lib/AppError.js'

const DEFAULT_SIGNED_URL_EXPIRY = 3600

export const uploadFile = async (
  bucket: string,
  filePath: string,
  buffer: Buffer,
  contentType: string,
) => {
  if (!supabase) {
    throw new AppError('Storage service not configured', 500)
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new AppError(`Upload failed: ${error.message}`, 500)
  }

  return { path: filePath }
}

export const deleteFile = async (bucket: string, filePath: string) => {
  if (!supabase) return

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    console.error(`Failed to delete ${filePath} from ${bucket}:`, error.message)
  }
}

export const getSignedUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = DEFAULT_SIGNED_URL_EXPIRY,
) => {
  if (!supabase) {
    throw new AppError('Storage service not configured', 500)
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    throw new AppError(`Failed to generate signed URL: ${error.message}`, 500)
  }

  return data.signedUrl
}
