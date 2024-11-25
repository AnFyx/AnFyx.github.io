import {signOut} from "@/auth";
import {Button} from "@radix-ui/themes";
import {redirect} from ;

<div className="flex justify-center mt-4 pt-4 border-t border-gray-300">
    <form action={async () => {
        'use server';
        await signOut();
    }}>
        <Button type="submit" variant="outline">
            Logout
        </Button>
    </form>
    redirect('/login');
</div>