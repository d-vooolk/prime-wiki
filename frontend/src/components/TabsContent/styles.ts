export const styles = {
    card: {
        marginTop: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        borderRadius: '12px',
        overflow: 'hidden'
    },
    tabs: {
        tabBar: {
            marginBottom: '24px',
            borderBottom: '1px solid #f0f0f0'
        }
    },
    imageContainer: {
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        height: 'fit-content'
    },
    image: {
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'contain'
    },
    title: {
        marginTop: 0,
        marginBottom: '16px'
    },
    tagContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    tag: {
        margin: 0
    },
    text: {
        fontSize: '16px'
    },
    divider: {
        margin: '24px 0'
    },
    quote: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: 'rgba(0, 0, 0, 0.85)',
        background: '#f5f5f5',
        padding: '16px 24px',
        borderRadius: '8px',
        borderLeft: '4px solid #1890ff',
        margin: 0,
        position: 'relative' as const,
        fontStyle: 'italic' as const
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    textArea: {
        width: '50em',
    },
    saveButton: {
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
} as const; 