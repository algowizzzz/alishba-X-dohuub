import { ChevronLeft } from 'lucide-react';
import type { Screen } from '../App';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button onClick={onBack} className="p-2 -ml-2 transition-all duration-200 hover:opacity-80 hover:-translate-x-1">
          <ChevronLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
        </button>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Terms of Service</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>Last Updated: December 1, 2025</p>

        <div className="space-y-6">
          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>1. Introduction</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>2. User Responsibilities</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>3. Service Usage</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>4. Payment Terms</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>5. Privacy and Data</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>6. Limitation of Liability</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>7. Termination</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </section>

          <section className="">
            <h4 className="mb-3" style={{ color: 'var(--foreground)' }}>8. Contact Information</h4>
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="p-4 rounded-xl shadow-card" style={{ backgroundColor: 'var(--secondary)' }}>
              <p className="mb-1" style={{ color: 'var(--foreground)' }}>Email: legal@dohuub.com</p>
              <p className="mb-1" style={{ color: 'var(--foreground)' }}>Phone: 1-800-DOHUUB1</p>
              <p style={{ color: 'var(--foreground)' }}>Address: 123 Service Lane, Suite 100, San Francisco, CA 94105</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
