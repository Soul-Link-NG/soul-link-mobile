export type UserIdentity = {
    displayName?: string | null;
    firstName?: string | null;
    email?: string | null;
    username?: string | null;
    soulId?: string | null;
};

function cleanValue(value?: string | null) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : '';
}

export function getEmailLocalPart(email?: string | null) {
    const cleanedEmail = cleanValue(email);
    if (!cleanedEmail || !cleanedEmail.includes('@')) {
        return '';
    }

    return cleanedEmail.split('@')[0]?.trim() || '';
}

export function getDisplayName(user?: UserIdentity | null) {
    const displayName = cleanValue(user?.displayName);
    if (displayName) {
        return displayName;
    }

    const firstName = cleanValue(user?.firstName);
    if (firstName) {
        return firstName;
    }

    const emailLocalPart = getEmailLocalPart(user?.email);
    if (emailLocalPart) {
        return emailLocalPart;
    }

    const username = cleanValue(user?.username);
    if (username) {
        return username;
    }

    return 'user';
}

export function getSoulId(user?: UserIdentity | null) {
    const soulId = cleanValue(user?.soulId);
    if (soulId) {
        return soulId;
    }

    const emailLocalPart = getEmailLocalPart(user?.email);
    if (emailLocalPart) {
        return emailLocalPart;
    }

    const username = cleanValue(user?.username);
    if (username) {
        return username;
    }

    return '';
}

export function getAvatarInitial(user?: UserIdentity | null) {
    const displayName = getDisplayName(user);
    return displayName[0]?.toUpperCase() || 'U';
}
