import RNFS from 'react-native-fs';

/**
 * Service for file system operations
 * Uses react-native-fs
 */
export class FileSystemService {
    async getFileInfo(filePath: string): Promise<{
        size: number;
        exists: boolean;
        path: string;
    } | null> {
        try {
            const exists = await RNFS.exists(filePath);
            if (!exists) {
                return {
                    size: 0,
                    exists: false,
                    path: filePath,
                };
            }

            const stat = await RNFS.stat(filePath);
            return {
                size: typeof stat.size === 'string' ? parseInt(stat.size) : stat.size,
                exists: true,
                path: stat.path,
            };
        } catch (error) {
            console.error('Failed to get file info:', error);
            return null;
        }
    }

    async copyFile(source: string, destination: string): Promise<boolean> {
        try {
            await RNFS.copyFile(source, destination);
            return true;
        } catch (error) {
            console.error('Failed to copy file:', error);
            return false;
        }
    }

    async moveFile(source: string, destination: string): Promise<boolean> {
        try {
            await RNFS.moveFile(source, destination);
            return true;
        } catch (error) {
            console.error('Failed to move file:', error);
            return false;
        }
    }

    async deleteFile(filePath: string): Promise<boolean> {
        try {
            await RNFS.unlink(filePath);
            return true;
        } catch (error) {
            console.error('Failed to delete file:', error);
            return false;
        }
    }

    async fileExists(filePath: string): Promise<boolean> {
        try {
            return await RNFS.exists(filePath);
        } catch (error) {
            console.error('Failed to check file existence:', error);
            return false;
        }
    }

    async createDirectory(dirPath: string): Promise<boolean> {
        try {
            await RNFS.mkdir(dirPath);
            return true;
        } catch (error) {
            console.error('Failed to create directory:', error);
            return false;
        }
    }

    getDocumentsDirectory(): string {
        return RNFS.DocumentDirectoryPath;
    }

    getCacheDirectory(): string {
        return RNFS.CachesDirectoryPath;
    }
}

// Singleton instance
export const fileSystemService = new FileSystemService();
